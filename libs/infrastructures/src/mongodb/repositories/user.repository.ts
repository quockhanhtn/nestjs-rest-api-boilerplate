import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { MongooseBaseRepository } from '@libs/core/mongoose/bases';
import { MongooseModel } from '@libs/core/mongoose/decorators';

import { UserDocument, UserEntity } from '../entities';

@Injectable()
export class UserRepository extends MongooseBaseRepository<UserEntity, UserDocument> {
  constructor(
    @MongooseModel(UserEntity.name)
    readonly dbModel: Model<UserEntity>,
  ) {
    super(dbModel);
  }
}
