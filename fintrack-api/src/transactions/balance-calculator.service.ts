import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from 'generated/prisma/client';

@Injectable()
export class BalanceCalculatorService {
  // efek transaksi terhadap saldo: income menambah, expense/transfer mengurangi
  signedAmount(
    type: TransactionType,
    amount: Prisma.Decimal | number,
  ): Prisma.Decimal {
    const decimalAmount = new Prisma.Decimal(amount);
    return type === 'income' ? decimalAmount : decimalAmount.negated();
  }

  // kebalikan dari signedAmount, dipakai untuk membatalkan efek transaksi lama
  reverseSignedAmount(
    type: TransactionType,
    amount: Prisma.Decimal | number,
  ): Prisma.Decimal {
    return this.signedAmount(type, amount).negated();
  }
}
