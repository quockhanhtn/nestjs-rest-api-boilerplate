import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAccessPayload, JwtAccessPayloadData } from '../auth';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createCategory(
    @JwtAccessPayload() authPayload: JwtAccessPayloadData,
    @Body() body: CreateCategoryDto,
  ) {
    return this.categoryService.create(body, authPayload.sub);
  }
}
