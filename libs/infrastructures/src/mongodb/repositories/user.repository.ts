import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { MgBaseFlatRepository } from '@libs/core/mongoose/bases';
import { MgModel } from '@libs/core/mongoose/decorators';

import { UserDocument, UserEntity } from '../entities';

@Injectable()
export class UserRepository extends MgBaseFlatRepository<UserEntity, UserDocument> {
  constructor(
    @MgModel(UserEntity.name)
    readonly dbModel: Model<UserEntity>,
  ) {
    super(dbModel);
  }
}
