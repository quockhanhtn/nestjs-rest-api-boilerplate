import {
  ClientSession,
  Document,
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
} from 'mongoose';

import {
  IMgCountOptions,
  IMgCreateManyOptions,
  IMgExistOptions,
  IMgFindAllOptions,
  IMgFindOneOptions,
  IMgManyOptions,
  IMgRawOptions,
  IMgRestoreManyOptions,
  IMgSaveOptions,
  IMgSoftDeleteManyOptions,
} from '@libs/core/mongoose/interfaces';

import { MG_DELETED_AT_FIELD_NAME } from '../../constants';
import { MgBaseEntity } from '../entities';

export abstract class MgBaseRepository<
  Entity extends MgBaseEntity,
  EntityDocument extends Document,
> {
  protected _repository: Model<Entity>;
  protected _joinOnFind?: PopulateOptions | PopulateOptions[];

  constructor(repository: Model<Entity>, options?: PopulateOptions | PopulateOptions[]) {
    this._repository = repository;
    this._joinOnFind = options;
  }

  async findAll<T = EntityDocument>(
    find?: FilterQuery<EntityDocument>,
    options?: IMgFindAllOptions<ClientSession>,
  ): Promise<T[]> {
    const findAll = this._repository.find<EntityDocument>(find);

    if (options?.withDeleted) {
      findAll.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      findAll.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findAll.select(options.select);
    }

    if (options?.paging) {
      findAll.limit(options.paging.limit).skip(options.paging.offset);
    }

    if (options?.order) {
      findAll.sort(options.order);
    }

    if (options?.join) {
      findAll.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.session) {
      findAll.session(options.session);
    }

    if (options?.lean) {
      findAll.lean();
    }

    return findAll.lean() as any;
  }

  async findAllDistinct<T = EntityDocument>(
    fieldDistinct: string,
    find?: FilterQuery<EntityDocument>,
    options?: IMgFindAllOptions<ClientSession>,
  ): Promise<T[]> {
    const findAll = this._repository.distinct<EntityDocument>(fieldDistinct, find);

    if (options?.withDeleted) {
      findAll.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      findAll.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findAll.select(options.select);
    }

    if (options?.paging) {
      findAll.limit(options.paging.limit).skip(options.paging.offset);
    }

    if (options?.order) {
      findAll.sort(options.order);
    }

    if (options?.join) {
      findAll.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.session) {
      findAll.session(options.session);
    }

    return findAll.lean() as any;
  }

  async findOne<T = EntityDocument>(
    find: FilterQuery<EntityDocument>,
    options?: IMgFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this._repository.findOne<EntityDocument>(find);

    if (options?.withDeleted) {
      findOne.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      findOne.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.session) {
      findOne.session(options.session);
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    if (options?.lean !== false) {
      findOne.lean();
    }

    return findOne.exec() as any;
  }

  async findOneById<T = EntityDocument>(
    _id: string,
    options?: IMgFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this._repository.findById<EntityDocument>(_id);

    if (options?.withDeleted) {
      findOne.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      findOne.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.session) {
      findOne.session(options.session);
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    if (options?.lean !== false) {
      findOne.lean();
    }

    return findOne.exec() as any;
  }

  async findOneAndLock<T = EntityDocument>(
    find: FilterQuery<EntityDocument>,
    options?: IMgFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this._repository.findOneAndUpdate<EntityDocument>(find, {
      new: true,
      useFindAndModify: false,
    });

    if (options?.withDeleted) {
      findOne.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      findOne.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.session) {
      findOne.session(options.session);
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    return findOne.exec() as any;
  }

  async findOneByIdAndLock<T = EntityDocument>(
    _id: string,
    options?: IMgFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this._repository.findByIdAndUpdate<EntityDocument>(_id, {
      new: true,
      useFindAndModify: false,
    });

    if (options?.withDeleted) {
      findOne.or([
        {
          [MG_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
        {
          [MG_DELETED_AT_FIELD_NAME]: { $exists: true },
        },
      ]);
    } else {
      findOne.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.session) {
      findOne.session(options.session);
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    return findOne.exec() as any;
  }

  async count(
    find?: FilterQuery<EntityDocument>,
    options?: IMgCountOptions<ClientSession>,
  ): Promise<number> {
    const count = this._repository.countDocuments(find);

    if (options?.withDeleted) {
      count.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      count.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.session) {
      count.session(options.session);
    }

    if (options?.join) {
      count.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    return count;
  }

  async exists(
    find: FilterQuery<EntityDocument>,
    options?: IMgExistOptions<ClientSession>,
  ): Promise<boolean> {
    if (options?.excludeId) {
      find = {
        ...find,
        _id: { $nin: options?.excludeId ?? [] },
      };
    }

    const exist = this._repository.exists(find);
    if (options?.withDeleted) {
      exist.or([
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: false } },
        { [MG_DELETED_AT_FIELD_NAME]: { $exists: true } },
      ]);
    } else {
      exist.where(MG_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.session) {
      exist.session(options.session);
    }

    if (options?.join) {
      exist.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    const result = await exist.lean();
    return result ? true : false;
  }

  async save(
    repository: EntityDocument & Document<string>,
    options?: IMgSaveOptions,
  ): Promise<EntityDocument> {
    return repository.save(options);
  }

  async delete(
    repository: EntityDocument & Document<string>,
    options?: IMgSaveOptions,
  ): Promise<EntityDocument> {
    return repository.deleteOne(options);
  }

  async softDelete(
    repository: EntityDocument & Document<string> & { deletedAt?: Date },
    options?: IMgSaveOptions,
  ): Promise<EntityDocument> {
    repository.deletedAt = new Date();
    return repository.save(options);
  }

  async restore(
    repository: EntityDocument & Document<string> & { deletedAt?: Date },
    options?: IMgSaveOptions,
  ): Promise<EntityDocument> {
    repository.deletedAt = undefined;
    return repository.save(options);
  }

  // bulk
  async createMany<Dto>(
    data: Dto[],
    options?: IMgCreateManyOptions<ClientSession>,
  ): Promise<boolean> {
    const create = this._repository.insertMany(data, {
      session: options ? options.session : undefined,
    });

    try {
      await create;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  async deleteManyByIds(
    listIds: string[],
    options?: IMgManyOptions<ClientSession>,
  ): Promise<number> {
    const del = this._repository.deleteMany({
      _id: {
        $in: listIds,
      },
    });

    if (options?.session) {
      del.session(options.session);
    }

    if (options?.join) {
      del.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      const rs = await del.exec();
      return rs.deletedCount;
    } catch (err: unknown) {
      throw err;
    }
  }

  async deleteMany(
    find: FilterQuery<EntityDocument>,
    options?: IMgManyOptions<ClientSession>,
  ): Promise<number> {
    const del = this._repository.deleteMany(find);

    if (options?.session) {
      del.session(options.session);
    }

    if (options?.join) {
      del.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      const rs = await del.exec();
      return rs.deletedCount;
    } catch (err: unknown) {
      throw err;
    }
  }

  async softDeleteManyByIds(
    listIds: string[],
    options?: IMgSoftDeleteManyOptions<ClientSession>,
  ): Promise<number> {
    const softDel = this._repository
      .updateMany(
        { _id: { $in: listIds } },
        {
          $set: { deletedAt: new Date() },
        },
      )
      .where(MG_DELETED_AT_FIELD_NAME)
      .exists(false);

    if (options?.session) {
      softDel.session(options.session);
    }

    if (options?.join) {
      softDel.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      const rs = await softDel.exec();
      return rs.modifiedCount;
    } catch (err: unknown) {
      throw err;
    }
  }

  async softDeleteMany(
    find: FilterQuery<EntityDocument>,
    options?: IMgSoftDeleteManyOptions<ClientSession>,
  ): Promise<number> {
    const softDel = this._repository
      .updateMany(find, {
        $set: {
          deletedAt: new Date(),
        },
      })
      .where(MG_DELETED_AT_FIELD_NAME)
      .exists(false);

    if (options?.session) {
      softDel.session(options.session);
    }

    if (options?.join) {
      softDel.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      const rs = await softDel.exec();
      return rs.modifiedCount;
    } catch (err: unknown) {
      throw err;
    }
  }

  async restoreManyByIds(
    listIds: string[],
    options?: IMgRestoreManyOptions<ClientSession>,
  ): Promise<number> {
    const rest = this._repository
      .updateMany(
        { _id: { $in: listIds } },
        {
          $set: { deletedAt: undefined },
        },
      )
      .where(MG_DELETED_AT_FIELD_NAME)
      .exists(true);

    if (options?.session) {
      rest.session(options.session);
    }

    if (options?.join) {
      rest.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      const rs = await rest.exec();
      return rs.modifiedCount;
    } catch (err: unknown) {
      throw err;
    }
  }

  async restoreMany(
    find: FilterQuery<EntityDocument>,
    options?: IMgRestoreManyOptions<ClientSession>,
  ): Promise<number> {
    const rest = this._repository
      .updateMany(find, {
        $set: { deletedAt: undefined },
      })
      .where(MG_DELETED_AT_FIELD_NAME)
      .exists(true);

    if (options?.session) {
      rest.session(options.session);
    }

    if (options?.join) {
      rest.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      const rs = await rest.exec();
      return rs.modifiedCount;
    } catch (err: unknown) {
      throw err;
    }
  }

  async updateMany<Dto>(
    find: FilterQuery<EntityDocument>,
    data: Dto,
    options?: IMgManyOptions<ClientSession>,
  ): Promise<boolean> {
    const update = this._repository
      .updateMany(find, {
        $set: data,
      })
      .where(MG_DELETED_AT_FIELD_NAME)
      .exists(false);

    if (options?.session) {
      update.session(options.session as ClientSession);
    }

    if (options?.join) {
      update.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      await update;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  async raw<RawResponse, RawQuery = PipelineStage[]>(
    rawOperation: RawQuery,
    options?: IMgRawOptions,
  ): Promise<RawResponse[]> {
    if (!Array.isArray(rawOperation)) {
      throw new Error('Must in array');
    }

    const pipeline: PipelineStage[] = rawOperation;

    if (options?.withDeleted) {
      pipeline.push({
        $match: {
          $or: [
            {
              [MG_DELETED_AT_FIELD_NAME]: {
                $exists: false,
              },
            },
            {
              [MG_DELETED_AT_FIELD_NAME]: { $exists: true },
            },
          ],
        },
      });
    } else {
      pipeline.push({
        $match: {
          [MG_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
      });
    }

    const aggregate = this._repository.aggregate<RawResponse>(pipeline);

    if (options?.session) {
      aggregate.session(options?.session);
    }

    return aggregate;
  }

  async model(): Promise<Model<Entity>> {
    return this._repository;
  }
}
