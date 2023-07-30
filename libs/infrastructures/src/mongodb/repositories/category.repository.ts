import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { MgBaseNestedSetRepository } from '@libs/core/mongoose/bases';
import { MgModel } from '@libs/core/mongoose/decorators';

import { CategoryDocument, CategoryEntity } from '../entities';

@Injectable()
export class CategoryRepository extends MgBaseNestedSetRepository<
  CategoryEntity,
  CategoryDocument
> {
  constructor(
    @MgModel(CategoryEntity.name)
    readonly dbModel: Model<CategoryEntity>,
  ) {
    super(dbModel);
  }
}
