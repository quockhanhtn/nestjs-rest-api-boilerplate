import { Injectable } from '@nestjs/common';

import { MongodbService } from '@libs/infrastructures';

import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly dbService: MongodbService) {}

  async create(body: CreateCategoryDto, sub: string) {
    const newCategory = await this.dbService.categoryRepo.create({
      ...body,
      createdBy: sub,
    });
    return newCategory;
  }
}
