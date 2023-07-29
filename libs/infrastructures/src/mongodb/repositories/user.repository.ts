import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { MongooseRepositoryAbstract } from '@libs/core/mongoose/abstracts';
import { MongooseModel } from '@libs/core/mongoose/decorators';

import { UserDocument, UserEntity } from '../entities';

@Injectable()
export class UserRepository extends MongooseRepositoryAbstract<UserEntity, UserDocument> {
  constructor(
    @MongooseModel(UserEntity.name)
    readonly dbModel: Model<UserEntity>,
  ) {
    super(dbModel);
  }
}
