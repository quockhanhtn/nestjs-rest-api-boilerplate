import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';

import { MongooseEntityAbstract } from '@libs/core/mongoose/abstracts';
import { MongooseEntity } from '@libs/core/mongoose/decorators';

import { UserEntity } from './user.entity';

export const UserSessionCollectionName = 'user-sessions';

@MongooseEntity({ collection: UserSessionCollectionName })
export class UserSessionEntity extends MongooseEntityAbstract {
  @Prop({
    required: true,
    ref: UserEntity.name,
  })
  user: string;

  @Prop()
  refreshToken: string;
}

export type UserSessionDocument = UserSessionEntity & Document;

export const UserSessionSchema = SchemaFactory.createForClass(UserSessionEntity);

UserSessionSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  next();
});
