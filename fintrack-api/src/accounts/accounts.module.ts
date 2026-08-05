import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountRepository } from './repositories/account.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [PrismaModule, TransactionsModule],
  controllers: [AccountsController],
  providers: [AccountsService, AccountRepository],
})
export class AccountsModule {}
