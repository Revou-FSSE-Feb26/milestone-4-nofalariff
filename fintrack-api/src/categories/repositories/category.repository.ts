import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategories() {
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with Id ${id} not found`);
    }
    return category;
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.getCategoryById(id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
