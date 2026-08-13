import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Prisma } from 'generated/prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

interface BalanceReassignment {
  oldAccountId: number;
  newAccountId: number;
  revertOldDelta: Prisma.Decimal;
  applyNewDelta: Prisma.Decimal;
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

  createTransaction(dto: CreateTransactionDto, balanceDelta: Prisma.Decimal) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: dto,
      });
      await tx.account.update({
        where: { id: dto.account_id },
        data: { balance: { increment: balanceDelta } },
      });
      return transaction;
    });
  }

  updateTransaction(
    id: number,
    dto: UpdateTransactionDto,
    {
      oldAccountId,
      newAccountId,
      revertOldDelta,
      applyNewDelta,
    }: BalanceReassignment,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // membatalkan efek transaksi lama ke akun lama
      await tx.account.update({
        where: { id: oldAccountId },
        data: { balance: { increment: revertOldDelta } },
      });
      // terapkan efek transaksi baru ke akun (baru atau sama)
      await tx.account.update({
        where: { id: newAccountId },
        data: { balance: { increment: applyNewDelta } },
      });
      return tx.transaction.update({ where: { id }, data: dto });
    });
  }

  deleteTransaction(
    id: number,
    accountId: number,
    revertDelta: Prisma.Decimal,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: revertDelta } },
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
