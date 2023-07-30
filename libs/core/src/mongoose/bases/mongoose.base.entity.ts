import { Prop } from '@nestjs/mongoose';
import { v4 as uuidV4 } from 'uuid';

export abstract class MongooseBaseEntity {
  @Prop({ type: String, default: uuidV4 })
  _id: string;

  @Prop({ required: false, index: true, type: Date })
  deletedAt?: Date;

  @Prop({ required: false, index: 'asc', type: Date })
  createdAt?: Date;

  @Prop({ required: false, index: 'desc', type: Date })
  updatedAt?: Date;
}
