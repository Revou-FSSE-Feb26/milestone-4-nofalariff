import {
  Controller,
  Get,
  Patch,
  Body,
  ParseIntPipe,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  getAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getAccountById(id);
  }

  @Post()
  createAccount(@Body() dto: CreateAccountDto) {
    return this.accountsService.createAccount(dto);
  }

  @Patch(':id')
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(id, dto);
  }

  @Delete(':id')
  deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.deleteAccount(id);
  }

  @Get(':id/transactions')
  getTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findByAccountWithCategory(id);
  }
}
