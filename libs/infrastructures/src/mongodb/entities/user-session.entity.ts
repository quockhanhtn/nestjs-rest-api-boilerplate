import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';

import { MongooseBaseEntity } from '@libs/core/mongoose/bases';
import { MongooseEntity } from '@libs/core/mongoose/decorators';

import { UserEntity } from './user.entity';

export const UserSessionCollectionName = 'user-sessions';

@MongooseEntity({ collection: UserSessionCollectionName })
export class UserSessionEntity extends MongooseBaseEntity {
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
