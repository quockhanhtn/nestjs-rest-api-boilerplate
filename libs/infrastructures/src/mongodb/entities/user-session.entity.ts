import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

import { MgBaseEntity } from '@libs/core/mongoose/bases';
import { MgEntity } from '@libs/core/mongoose/decorators';
import { RequestInfoData } from '@libs/core/request';

import { UserEntity } from './user.entity';

export const UserSessionCollectionName = 'user-sessions';

@MgEntity({ collection: UserSessionCollectionName })
export class UserSessionEntity extends MgBaseEntity {
  @Prop({
    required: true,
    ref: UserEntity.name,
  })
  user: string;

  @Prop({ type: String, default: uuidV4, index: true, unique: true })
  sessionId: string;

  @Prop({ type: String })
  hashedRefreshToken: string;

  @Prop({ type: Object })
  metaData: RequestInfoData;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSessionEntity);

UserSessionSchema.index({ user: 1, sessionId: 1 }, { unique: true });

UserSessionSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  next();
});

export type UserSessionDocument = UserSessionEntity & Document;
