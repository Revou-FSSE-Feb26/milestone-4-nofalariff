import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { BalanceCalculatorService } from './balance-calculator.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly balanceCalculator: BalanceCalculatorService,
  ) {}

  getAllTransactions() {
    return this.transactionRepository.getAllTransactions();
  }

  getTransactionById(id: number) {
    return this.transactionRepository.getTransactionById(id);
  }

  createTransaction(dto: CreateTransactionDto) {
    const balanceDelta = this.balanceCalculator.signedAmount(
      dto.type,
      dto.amount,
    );
    return this.transactionRepository.createTransaction(dto, balanceDelta);
  }

  async updateTransaction(id: number, dto: UpdateTransactionDto) {
    const existing = await this.transactionRepository.getTransactionById(id);

    const newAccountId = dto.account_id ?? existing.account_id;
    const newType = dto.type ?? existing.type;
    const newAmount = dto.amount ?? existing.amount;

    return this.transactionRepository.updateTransaction(id, dto, {
      oldAccountId: existing.account_id,
      newAccountId,
      revertOldDelta: this.balanceCalculator.reverseSignedAmount(
        existing.type,
        existing.amount,
      ),
      applyNewDelta: this.balanceCalculator.signedAmount(newType, newAmount),
    });
  }

  async deleteTransaction(id: number) {
    const existing = await this.transactionRepository.getTransactionById(id);
    const revertDelta = this.balanceCalculator.reverseSignedAmount(
      existing.type,
      existing.amount,
    );
    return this.transactionRepository.deleteTransaction(
      id,
      existing.account_id,
      revertDelta,
    );
  }

  findByAccountWithCategory(accountId: number) {
    return this.transactionRepository.findByAccountWithCategory(accountId);
  }
}
