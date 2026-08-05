import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionRepository } from './repository/transaction.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
  exports: [TransactionsService],
})
export class TransactionsModule {}
