import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  getAllUsers() {
    return this.prisma.user.findMany();
  }

  // menggunakan async/await untuk menunggu hasil dari query database
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    }); // memastikan user yang dicari ada di database, jika tidak ada maka akan mengembalikan NotFoundException

    if (!user) {
      throw new NotFoundException(`User with Id ${id} not found`);
    }

    return user;
  }

  createUser(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.getUserById(id); // memastikan user yang dicari ada di database sebelum melakukan update, jika tidak ada return NotFoundExeption

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async deleteUser(id: number) {
    await this.getUserById(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
