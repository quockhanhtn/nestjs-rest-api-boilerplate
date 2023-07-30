import { Model } from 'mongoose';

import { MongooseBaseRepository } from '@libs/core/mongoose/bases';
import { MongooseModel } from '@libs/core/mongoose/decorators';

import { UserEntity, UserSessionDocument, UserSessionEntity } from '../entities';

export class UserSessionRepository extends MongooseBaseRepository<
  UserSessionEntity,
  UserSessionDocument
> {
  constructor(
    @MongooseModel(UserSessionEntity.name)
    readonly dbModel: Model<UserSessionEntity>,
  ) {
    super(dbModel, {
      path: 'user',
      localField: 'user',
      foreignField: '_id',
      model: UserEntity.name,
    });
  }
}
