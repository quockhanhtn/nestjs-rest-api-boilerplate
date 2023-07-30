import { PopulateOptions } from 'mongoose';

// find one
export interface IMgFindOneOptions<T = any> {
  order?: Record<string, 'asc' | 'desc'>;
  select?: Record<string, boolean | number>;
  join?: boolean | PopulateOptions | PopulateOptions[];
  session?: T;
  withDeleted?: boolean;
  lean?: boolean;
}

// find all
export interface IMgFindAllOptions<T = any> extends IMgFindOneOptions<T> {
  paging?: {
    limit: number;
    offset: number;
  };
}

// count
export type IMgCountOptions<T = any> = Pick<
  IMgFindOneOptions<T>,
  'session' | 'withDeleted' | 'join'
>;

// save
export type IMgSaveOptions<T = any> = Pick<IMgFindOneOptions<T>, 'session'>;

// create
export interface IMgCreateOptions<T = any> extends Pick<IMgFindOneOptions<T>, 'session'> {
  _id?: string;
}

// exist
export interface IMgExistOptions<T = any>
  extends Pick<IMgFindOneOptions<T>, 'session' | 'withDeleted' | 'join'> {
  excludeId?: string[];
}

// bulk
export type IMgManyOptions<T = any> = Pick<IMgFindOneOptions<T>, 'session' | 'join'>;
export type IMgCreateManyOptions<T = any> = Pick<IMgFindOneOptions<T>, 'session'>;
export type IMgSoftDeleteManyOptions<T = any> = IMgManyOptions<T>;
export type IMgRestoreManyOptions<T = any> = IMgManyOptions<T>;
export type IMgRawOptions<T = any> = Pick<IMgFindOneOptions<T>, 'session' | 'withDeleted'>;
