import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository],
})
export class CategoriesModule {}
