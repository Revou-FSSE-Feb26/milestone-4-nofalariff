import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Injectable()
export class AccountRepository {
  constructor(private prisma: PrismaService) {}

  // ownerId null berarti Admin (tidak difilter, lihat semua akun)
  getAllAccounts(ownerId: number | null) {
    return this.prisma.account.findMany({
      where: ownerId === null ? undefined : { user_id: ownerId },
    });
  }

  async getAccountById(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Account with Id ${id} not found`);
    }

    return account;
  }

  createAccount(dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: dto,
    });
  }

  async updateAccount(id: number, dto: UpdateAccountDto) {
    await this.getAccountById(id);

    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  async deleteAccount(id: number) {
    await this.getAccountById(id);

    return this.prisma.account.delete({
      where: { id },
    });
  }
}
