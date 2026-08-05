import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionType } from 'generated/prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

// fungsi untuk menambak atau mengurangi saldo Amount
function signedAmount(type: TransactionType, amount: number): number {
  return type === 'income' ? amount : -amount;
}

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  getAllTransactions() {
    return this.prisma.transaction.findMany();
  }

  async getTransactionById(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction With Id ${id} not found`);
    }

    return transaction;
  }

  createTransaction(dto: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: dto,
      });
      await tx.account.update({
        where: { id: dto.account_id },
        data: { balance: { increment: signedAmount(dto.type, dto.amount) } },
      });
      return transaction;
    });
  }

  async updateTransaction(id: number, dto: UpdateTransactionDto) {
    const existing = await this.getTransactionById(id); // variable untuk data yang sudah ada

    /* Variable untuk membuat update baru menggunakan operator ?? "Nullish Coalescing Operator" artinya 
      gunakan nilai di kiri jika ada, kalau tidak gunakan nilai kanan.
    */

    const newAccountId = dto.account_id ?? existing.account_id;
    const newType = dto.type ?? existing.type;
    const newAmount = dto.amount ?? existing.amount;

    return this.prisma.$transaction(async (tx) => {
      // membatalkan transaksi lama ke akun lama
      await tx.account.update({
        where: { id: existing.account_id },
        data: {
          balance: {
            decrement: signedAmount(existing.type, existing.amount),
          },
        },
      });
      // terapkan efek transaksi baru ke akun (baru atau sama)
      await tx.account.update({
        where: { id: newAccountId },
        data: { balance: { increment: signedAmount(newType, newAmount) } },
      });
      return tx.transaction.update({ where: { id }, data: dto });
    });
  }

  async deleteTransaction(id: number) {
    const existing = await this.getTransactionById(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: existing.account_id },
        data: {
          balance: { decrement: signedAmount(existing.type, existing.amount) },
        },
      });
      return tx.transaction.delete({
        where: { id },
      });
    });
  }

  // Relasional di Account
  findByAccountWithCategory(accountId: number) {
    return this.prisma.transaction.findMany({
      where: { account_id: accountId },
      include: { category: true },
      orderBy: { transaction_date: 'desc' },
    });
  }
}
