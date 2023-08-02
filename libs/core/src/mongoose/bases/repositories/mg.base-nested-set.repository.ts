import { ClientSession, Document, Model, PopulateOptions } from 'mongoose';

import { IMgCreateOptions } from '../../interfaces';
import { MgBaseNestedSetEntity } from '../entities';
import { MgBaseRepository } from './mg.base.repository';

export type TreeEntityDocument<T> = T & {
  children?: Array<TreeEntityDocument<T>>;
};

export abstract class MgBaseNestedSetRepository<
  Entity extends MgBaseNestedSetEntity,
  EntityDocument extends MgBaseNestedSetEntity & Document,
> extends MgBaseRepository<Entity, EntityDocument> {
  constructor(repository: Model<Entity>, options?: PopulateOptions | PopulateOptions[]) {
    super(repository, options);
  }

  private _findChild(
    left: number,
    right: number,
    allNodes: Array<EntityDocument>,
  ): TreeEntityDocument<EntityDocument>[] {
    if (left + 1 === right) {
      return [];
    }
    const allChild = allNodes.filter((n) => n.left > left && n.right < right);

    return allChild
      .filter((node) => !allChild.some((n) => node.left > n.left && node.right < n.right))
      .map((node: TreeEntityDocument<EntityDocument>) => {
        node.children = this._findChild(node.left, node.right, allChild);
        return node;
      });
  }

  async getFullTree(): Promise<TreeEntityDocument<EntityDocument>[]> {
    const allNodes = await this.findAll<EntityDocument>(
      {},
      {
        withDeleted: true,
        order: { left: 'asc' },
      },
    );

    return allNodes
      .filter((node) => !allNodes.some((n) => node.left > n.left && node.right < n.right))
      .map((node: TreeEntityDocument<EntityDocument>) => {
        node.children = this._findChild(node.left, node.right, allNodes);
        return node;
      });
  }

  async create(
    data: Omit<Partial<Entity>, 'left' | 'right'> & {
      parentId?: string;
    },
    options?: IMgCreateOptions<ClientSession>,
  ): Promise<EntityDocument> {
    let rightValue = 0;
    if (data?.parentId) {
      const parentNode = await this._repository.findById(data.parentId, { right: 1 }).lean().exec();
      if (parentNode && parentNode?.right) {
        rightValue = parentNode.right;
      }
    }
    if (rightValue === 0) {
      const maxRight = await this._repository
        .findOne({}, { right: 1 })
        .sort({ right: -1 })
        .lean()
        .exec();
      rightValue = (maxRight?.right ?? 0) + 1;
    }

    // update left and right for other nodes
    await Promise.all([
      // Step 1: Increment left values greater than the parent's right value by 2
      this._repository.updateMany({ left: { $gt: rightValue } }, { $inc: { left: 2 } }).exec(),

      // Step 2: Increment right values greater than or equal to the parent's right value by 2
      this._repository.updateMany({ right: { $gte: rightValue } }, { $inc: { right: 2 } }).exec(),
    ]);

    const dataCreate: Record<string, any> = data;

    if (options?._id) {
      dataCreate._id = options._id;
    }
    dataCreate.left = rightValue;
    dataCreate.right = rightValue + 1;

    const created = await this._repository.create([dataCreate], {
      session: options ? options.session : undefined,
    });
    return created[0] as EntityDocument;
  }
}
