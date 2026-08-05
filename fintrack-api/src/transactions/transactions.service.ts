import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  getAllTransactions() {
    return this.transactionRepository.getAllTransactions();
  }

  getTransactionById(id: number) {
    return this.transactionRepository.getTransactionById(id);
  }

  createTransaction(dto: CreateTransactionDto) {
    return this.transactionRepository.createTransaction(dto);
  }

  updateTransaction(id: number, dto: UpdateTransactionDto) {
    return this.transactionRepository.updateTransaction(id, dto);
  }

  deleteTransaction(id: number) {
    return this.transactionRepository.deleteTransaction(id);
  }

  findByAccountWithCategory(accountId: number) {
    return this.transactionRepository.findByAccountWithCategory(accountId);
  }
}
