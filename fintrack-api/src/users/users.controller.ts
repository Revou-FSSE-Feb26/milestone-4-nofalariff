import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Ambil semua user' })
  @ApiResponse({ status: 200, description: 'Daftar user berhasil diambil' })
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Ambil satu user berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User ditemukan' })
  @ApiResponse({ status: 404, description: 'User dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Buat user baru' })
  @ApiResponse({ status: 201, description: 'User berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Ubah data user berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User berhasil diubah' })
  @ApiResponse({ status: 404, description: 'User dengan ID tersebut tidak ditemukan' })
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Hapus user berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'User dengan ID tersebut tidak ditemukan' })
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
