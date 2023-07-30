import { ClientSession, Document, Model, PopulateOptions } from 'mongoose';

import { IMgCreateOptions } from '../../interfaces';
import { MgBaseNestedSetEntity } from '../entities';
import { MgBaseRepository } from './mg.base.repository';

export abstract class MgBaseNestedSetRepository<
  Entity extends MgBaseNestedSetEntity,
  EntityDocument extends Document,
> extends MgBaseRepository<Entity, EntityDocument> {
  constructor(repository: Model<Entity>, options?: PopulateOptions | PopulateOptions[]) {
    super(repository, options);
  }

  async create(
    data: Omit<Partial<Entity>, 'left' | 'right'> & {
      parentId: string;
    },
    options?: IMgCreateOptions<ClientSession>,
  ): Promise<EntityDocument> {
    const parentNode = await this._repository.findById(data.parentId, { right: 1 }).lean().exec();
    const rightValue = parentNode ? parentNode.right : 0;

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
