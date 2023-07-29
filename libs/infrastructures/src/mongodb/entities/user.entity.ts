import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';

import { MongooseEntityAbstract } from '@libs/core/mongoose/abstracts';
import { MongooseEntity } from '@libs/core/mongoose/decorators';

import { Role } from '../../roles/enums';

export const UserCollectionName = 'users';

@MongooseEntity({ collection: UserCollectionName })
export class UserEntity extends MongooseEntityAbstract {
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

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}

export type UserDocument = UserEntity & Document;

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
