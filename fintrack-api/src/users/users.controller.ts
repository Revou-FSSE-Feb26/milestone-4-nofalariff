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
  ApiSecurity,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@ApiTags('Users')
// satu object = x-api DAN jwt wajib bareng (AND), bukan alternatif
@ApiSecurity({ 'x-api': [], jwt: [] })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Ambil semua user (Admin only)' })
  @ApiResponse({ status: 200, description: 'Daftar user berhasil diambil' })
  @Roles(Role.Admin)
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Ambil satu user berdasarkan ID (diri sendiri atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User ditemukan' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'User dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.usersService.getUserById(id, currentUser);
  }

  @ApiOperation({ summary: 'Buat user baru (Admin only, gunakan /auth/register untuk self-registration)' })
  @ApiResponse({ status: 201, description: 'User berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @Roles(Role.Admin)
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Ubah data user (diri sendiri atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User berhasil diubah' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'User dengan ID tersebut tidak ditemukan' })
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.usersService.updateUser(id, dto, currentUser);
  }

  @ApiOperation({ summary: 'Hapus user (diri sendiri atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID user', example: 1 })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'User dengan ID tersebut tidak ditemukan' })
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.usersService.deleteUser(id, currentUser);
  }
}
