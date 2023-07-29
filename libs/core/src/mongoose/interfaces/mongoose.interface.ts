import { PopulateOptions } from 'mongoose';

import { IPaginationOptions } from './pagination.interface';

// find one
export interface IMongooseFindOneOptions<T = any> extends Pick<IPaginationOptions, 'order'> {
  select?: Record<string, boolean | number>;
  join?: boolean | PopulateOptions | PopulateOptions[];
  session?: T;
  withDeleted?: boolean;
}

export type IMongooseGetTotalOptions<T = any> = Pick<
  IMongooseFindOneOptions<T>,
  'session' | 'withDeleted' | 'join'
>;

export type IMongooseSaveOptions<T = any> = Pick<IMongooseFindOneOptions<T>, 'session'>;

// find
export interface IMongooseFindAllOptions<T = any>
  extends IPaginationOptions,
    Omit<IMongooseFindOneOptions<T>, 'order'> {}

// create
export interface IMongooseCreateOptions<T = any>
  extends Pick<IMongooseFindOneOptions<T>, 'session'> {
  _id?: string;
}

// exist
export interface IMongooseExistOptions<T = any>
  extends Pick<IMongooseFindOneOptions<T>, 'session' | 'withDeleted' | 'join'> {
  excludeId?: string[];
}

// bulk
export type IMongooseManyOptions<T = any> = Pick<IMongooseFindOneOptions<T>, 'session' | 'join'>;

export type IMongooseCreateManyOptions<T = any> = Pick<IMongooseFindOneOptions<T>, 'session'>;

export type IMongooseSoftDeleteManyOptions<T = any> = IMongooseManyOptions<T>;

export type IMongooseRestoreManyOptions<T = any> = IMongooseManyOptions<T>;

export type IMongooseRawOptions<T = any> = Pick<
  IMongooseFindOneOptions<T>,
  'session' | 'withDeleted'
>;
