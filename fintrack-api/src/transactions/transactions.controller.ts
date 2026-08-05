import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Body,
  Patch,
  Delete,
  Post,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Get()
  getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  getTransactionById(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.getTransactionById(id);
  }

  @Post()
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  @Patch(':id')
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(id, dto);
  }

  @Delete(':id')
  deleteTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.deleteTransaction(id);
  }
}
