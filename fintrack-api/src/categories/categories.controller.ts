import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Body,
  Patch,
  Delete,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/client';

@ApiTags('Categories')
@ApiBearerAuth('jwt')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Ambil semua kategori' })
  @ApiResponse({ status: 200, description: 'Daftar kategori berhasil diambil' })
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @ApiOperation({ summary: 'Ambil satu kategori berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID kategori', example: 1 })
  @ApiResponse({ status: 200, description: 'Kategori ditemukan' })
  @ApiResponse({ status: 404, description: 'Kategori dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'Buat kategori baru (Admin only, kategori adalah data master bersama)' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @ApiResponse({ status: 403, description: 'Role bukan Admin' })
  @Roles(Role.Admin)
  @Post()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @ApiOperation({ summary: 'Ubah data kategori berdasarkan ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID kategori', example: 1 })
  @ApiResponse({ status: 200, description: 'Kategori berhasil diubah' })
  @ApiResponse({ status: 403, description: 'Role bukan Admin' })
  @ApiResponse({ status: 404, description: 'Kategori dengan ID tersebut tidak ditemukan' })
  @Roles(Role.Admin)
  @Patch(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @ApiOperation({ summary: 'Hapus kategori berdasarkan ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID kategori', example: 1 })
  @ApiResponse({ status: 200, description: 'Kategori berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Role bukan Admin' })
  @ApiResponse({ status: 404, description: 'Kategori dengan ID tersebut tidak ditemukan' })
  @Roles(Role.Admin)
  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
