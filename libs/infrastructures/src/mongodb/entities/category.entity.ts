import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MgBaseNestedSetEntity } from '@libs/core/mongoose/bases';
import { MgEntity } from '@libs/core/mongoose/decorators';

import { UserEntity } from './user.entity';

export const CategoryCollectionName = 'categories';

@MgEntity({ collection: CategoryCollectionName })
export class CategoryEntity extends MgBaseNestedSetEntity {
  @Prop({
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;

  @Prop({ type: String, trim: true, required: false })
  description?: string;

  @Prop({ required: false, ref: UserEntity.name })
  createdBy: string;

  @Prop({ required: false, ref: UserEntity.name })
  updatedBy: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);

export type CategoryDocument = CategoryEntity & Document;
