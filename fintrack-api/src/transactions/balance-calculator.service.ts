import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from 'generated/prisma/client';

export interface BalanceEffect {
  accountId: number;
  delta: Prisma.Decimal;
}

@Injectable()
export class BalanceCalculatorService {
  // efek transaksi terhadap saldo tiap akun yang terlibat:
  // income menambah saldo account_id, expense mengurangi saldo account_id,
  // transfer mengurangi saldo account_id dan menambah saldo to_account_id
  computeEffects(
    type: TransactionType,
    amount: Prisma.Decimal | number,
    accountId: number,
    toAccountId?: number | null,
  ): BalanceEffect[] {
    const decimalAmount = new Prisma.Decimal(amount);

    if (type === 'transfer') {
      if (!toAccountId) {
        throw new BadRequestException(
          'to_account_id wajib diisi untuk transaksi bertipe transfer',
        );
      }
      return [
        { accountId, delta: decimalAmount.negated() },
        { accountId: toAccountId, delta: decimalAmount },
      ];
    }

    return [
      {
        accountId,
        delta: type === 'income' ? decimalAmount : decimalAmount.negated(),
      },
    ];
  }

  // kebalikan efek, dipakai untuk membatalkan efek transaksi lama (update/delete)
  reverseEffects(effects: BalanceEffect[]): BalanceEffect[] {
    return effects.map((effect) => ({
      accountId: effect.accountId,
      delta: effect.delta.negated(),
    }));
  }
}
