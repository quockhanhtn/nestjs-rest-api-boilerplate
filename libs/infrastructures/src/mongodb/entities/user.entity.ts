import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';

import { MgBaseEntity } from '@libs/core/mongoose/bases';
import { MgEntity } from '@libs/core/mongoose/decorators';

import { RoleEnum } from '../enums';

export const UserCollectionName = 'users';

@MgEntity({ collection: UserCollectionName })
export class UserEntity extends MgBaseEntity {
  @Prop({
    type: String,
    trim: true,
    required: false,
    maxlength: 100,
  })
  name?: string;

  @Prop({
    type: String,
    trim: true,
    required: false,
    sparse: true,
    index: true,
    unique: true,
    maxlength: 20,
  })
  username?: string;

  @Prop({
    type: String,
    trim: true,
    required: false,
    sparse: true,
    index: true,
    unique: true,
    maxlength: 50,
  })
  email?: string;

  @Prop({ required: false, index: true, type: Date })
  emailVerifiedAt?: Date;

  @Prop({
    type: String,
    trim: true,
    required: false,
    sparse: true,
    index: true,
    unique: true,
    maxlength: 15,
  })
  phoneNumber?: string;
  @Prop({ required: false, index: true, type: Date })
  phoneNumberVerifiedAt?: Date;

  @Prop()
  hashedPwd: string;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.User })
  role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  if (!this.email && !this.phoneNumber) {
    throw new Error('Must provide email or phone number');
  }
  next();
});

export type UserDocument = UserEntity & Document;
