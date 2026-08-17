import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { BalanceEffect } from '../balance-calculator.service';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  // ownerId null berarti Admin (tidak difilter, lihat semua transaksi)
  getAllTransactions(ownerId: number | null) {
    return this.prisma.transaction.findMany({
      where: ownerId === null ? undefined : { account: { user_id: ownerId } },
    });
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

  // dipakai untuk ownership check sebelum baca/tulis akun sumber/tujuan
  async getAccountOwnerId(accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { user_id: true },
    });

    if (!account) {
      throw new NotFoundException(`Account with Id ${accountId} not found`);
    }

    return account.user_id;
  }

  private applyEffects(
    tx: Prisma.TransactionClient,
    effects: BalanceEffect[],
  ) {
    return Promise.all(
      effects.map((effect) =>
        tx.account.update({
          where: { id: effect.accountId },
          data: { balance: { increment: effect.delta } },
        }),
      ),
    );
  }

  createTransaction(dto: CreateTransactionDto, effects: BalanceEffect[]) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({ data: dto });
      await this.applyEffects(tx, effects);
      return transaction;
    });
  }

  updateTransaction(
    id: number,
    dto: UpdateTransactionDto,
    revertOldEffects: BalanceEffect[],
    applyNewEffects: BalanceEffect[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      // membatalkan efek transaksi lama, lalu terapkan efek transaksi baru
      await this.applyEffects(tx, revertOldEffects);
      await this.applyEffects(tx, applyNewEffects);
      return tx.transaction.update({ where: { id }, data: dto });
    });
  }

  deleteTransaction(id: number, revertEffects: BalanceEffect[]) {
    return this.prisma.$transaction(async (tx) => {
      await this.applyEffects(tx, revertEffects);
      return tx.transaction.delete({ where: { id } });
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
