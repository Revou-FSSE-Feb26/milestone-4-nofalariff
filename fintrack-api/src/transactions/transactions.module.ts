import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionRepository } from './repository/transaction.repository';
import { BalanceCalculatorService } from './balance-calculator.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
    BalanceCalculatorService,
  ],
  exports: [TransactionsService, BalanceCalculatorService],
})
export class TransactionsModule {}
