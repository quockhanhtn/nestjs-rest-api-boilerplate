import { Injectable } from '@nestjs/common';

import { MongodbService } from '@libs/infrastructures';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly dbService: MongodbService) {}

  async findAll() {
    return this.dbService.categoryRepo.getFullTree();
  }

  async findOne(id: string) {
    throw new Error('Method not implemented.');
  }

  async create(body: CreateCategoryDto, sub: string) {
    const newCategory = await this.dbService.categoryRepo.create({
      ...body,
      createdBy: sub,
    });
    return newCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    throw new Error('Method not implemented.');
  }
  async remove(id: string) {
    throw new Error('Method not implemented.');
  }
}
