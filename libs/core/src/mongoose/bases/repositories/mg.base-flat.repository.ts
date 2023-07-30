import { ClientSession, Document, Model, PopulateOptions } from 'mongoose';

import { IMgCreateOptions } from '@libs/core/mongoose/interfaces';

import { MgBaseEntity } from '../entities';
import { MgBaseRepository } from './mg.base.repository';

export abstract class MgBaseFlatRepository<
  Entity extends MgBaseEntity,
  EntityDocument extends Document,
> extends MgBaseRepository<Entity, EntityDocument> {
  constructor(repository: Model<Entity>, options?: PopulateOptions | PopulateOptions[]) {
    super(repository, options);
  }

  async create(
    data: Partial<Entity>,
    options?: IMgCreateOptions<ClientSession>,
  ): Promise<EntityDocument> {
    const dataCreate: Record<string, any> = data;

    if (options?._id) {
      dataCreate._id = options._id;
    }

    const created = await this._repository.create([dataCreate], {
      session: options ? options.session : undefined,
    });

    return created[0] as EntityDocument;
  }
}
