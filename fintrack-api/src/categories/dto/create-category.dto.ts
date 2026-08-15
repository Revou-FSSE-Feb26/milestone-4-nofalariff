import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CategoryType } from 'generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nama kategori',
    example: 'Salary',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Jenis kategori',
    enum: CategoryType,
    example: CategoryType.income,
  })
  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;
}
