import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CategoryDocument,
  CategoryEntity,
  UserDocument,
  UserEntity,
  UserSessionDocument,
  UserSessionEntity,
} from './entities';
import { CategoryRepository, UserRepository, UserSessionRepository } from './repositories';

@Injectable()
export class MongodbService implements OnApplicationBootstrap {
  usersRepo: UserRepository;
  userSessionsRepo: UserSessionRepository;
  categoryRepo: CategoryRepository;

  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserSessionEntity.name)
    private readonly userSessionModel: Model<UserSessionDocument>,
    @InjectModel(CategoryEntity.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  onApplicationBootstrap() {
    this.usersRepo = new UserRepository(this.userModel);
    this.userSessionsRepo = new UserSessionRepository(this.userSessionModel);
    this.categoryRepo = new CategoryRepository(this.categoryModel);
  }
}
