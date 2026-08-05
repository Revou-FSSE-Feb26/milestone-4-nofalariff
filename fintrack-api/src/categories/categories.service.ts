import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  getCategoryById(id: number) {
    return this.categoryRepository.getCategoryById(id);
  }

  createCategory(dto: CreateCategoryDto) {
    return this.categoryRepository.createCategory(dto);
  }

  updateCategory(id: number, dto: UpdateCategoryDto) {
    return this.categoryRepository.updateCategory(id, dto);
  }

  deleteCategory(id: number) {
    return this.categoryRepository.deleteCategory(id);
  }
}
