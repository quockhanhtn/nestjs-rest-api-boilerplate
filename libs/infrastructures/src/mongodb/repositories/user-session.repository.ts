import { Model } from 'mongoose';

import { MgBaseFlatRepository } from '@libs/core/mongoose/bases';
import { MgModel } from '@libs/core/mongoose/decorators';

import { UserEntity, UserSessionDocument, UserSessionEntity } from '../entities';

export class UserSessionRepository extends MgBaseFlatRepository<
  UserSessionEntity,
  UserSessionDocument
> {
  constructor(
    @MgModel(UserSessionEntity.name)
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
