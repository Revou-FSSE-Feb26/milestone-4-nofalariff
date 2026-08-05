import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CategoryType } from 'generated/prisma/client';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;
}
