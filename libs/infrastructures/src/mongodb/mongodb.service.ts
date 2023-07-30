import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDocument, UserEntity, UserSessionDocument, UserSessionEntity } from './entities';
import { UserRepository, UserSessionRepository } from './repositories';

@Injectable()
export class MongodbService implements OnApplicationBootstrap {
  usersRepo: UserRepository;
  userSessionsRepo: UserSessionRepository;

  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserSessionEntity.name)
    private readonly userSessionModel: Model<UserSessionDocument>,
  ) {}

  onApplicationBootstrap() {
    this.usersRepo = new UserRepository(this.userModel);
    this.userSessionsRepo = new UserSessionRepository(this.userSessionModel);
  }
}
