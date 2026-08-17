import { ForbiddenException, Injectable } from '@nestjs/common';
import { TransactionRepository } from './repository/transaction.repository';
import { BalanceCalculatorService } from './balance-calculator.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { assertOwnerOrAdmin } from 'src/common/authorization/assert-owner';
import { Role } from 'generated/prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly balanceCalculator: BalanceCalculatorService,
  ) {}

  getAllTransactions(currentUser: CurrentUserPayload) {
    const ownerId = currentUser.role === Role.Admin ? null : currentUser.id;
    return this.transactionRepository.getAllTransactions(ownerId);
  }

  async getTransactionById(id: number, currentUser: CurrentUserPayload) {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
    );
    const ownerId = await this.transactionRepository.getAccountOwnerId(
      transaction.account_id,
    );
    assertOwnerOrAdmin(currentUser, ownerId);
    return transaction;
  }

  // memastikan account_id (dan to_account_id jika transfer) benar milik user yang sama
  private async assertAccountsOwnership(
    accountId: number,
    toAccountId: number | null | undefined,
    currentUser: CurrentUserPayload,
  ) {
    const sourceOwnerId = await this.transactionRepository.getAccountOwnerId(
      accountId,
    );
    assertOwnerOrAdmin(currentUser, sourceOwnerId);

    if (toAccountId) {
      const destOwnerId = await this.transactionRepository.getAccountOwnerId(
        toAccountId,
      );
      if (destOwnerId !== sourceOwnerId) {
        throw new ForbiddenException(
          'Transfer hanya diperbolehkan antar akun milik user yang sama',
        );
      }
    }
  }

  async createTransaction(
    dto: CreateTransactionDto,
    currentUser: CurrentUserPayload,
  ) {
    await this.assertAccountsOwnership(
      dto.account_id,
      dto.to_account_id,
      currentUser,
    );

    const effects = this.balanceCalculator.computeEffects(
      dto.type,
      dto.amount,
      dto.account_id,
      dto.to_account_id,
    );
    return this.transactionRepository.createTransaction(dto, effects);
  }

  async updateTransaction(
    id: number,
    dto: UpdateTransactionDto,
    currentUser: CurrentUserPayload,
  ) {
    const existing = await this.transactionRepository.getTransactionById(id);
    const existingOwnerId = await this.transactionRepository.getAccountOwnerId(
      existing.account_id,
    );
    assertOwnerOrAdmin(currentUser, existingOwnerId);

    const newAccountId = dto.account_id ?? existing.account_id;
    const newType = dto.type ?? existing.type;
    const newAmount = dto.amount ?? existing.amount;
    const newToAccountId =
      dto.to_account_id !== undefined
        ? dto.to_account_id
        : existing.to_account_id;

    await this.assertAccountsOwnership(
      newAccountId,
      newType === 'transfer' ? newToAccountId : null,
      currentUser,
    );

    const revertOldEffects = this.balanceCalculator.reverseEffects(
      this.balanceCalculator.computeEffects(
        existing.type,
        existing.amount,
        existing.account_id,
        existing.to_account_id,
      ),
    );
    const applyNewEffects = this.balanceCalculator.computeEffects(
      newType,
      newAmount,
      newAccountId,
      newToAccountId,
    );

    return this.transactionRepository.updateTransaction(
      id,
      dto,
      revertOldEffects,
      applyNewEffects,
    );
  }

  async deleteTransaction(id: number, currentUser: CurrentUserPayload) {
    const existing = await this.transactionRepository.getTransactionById(id);
    const ownerId = await this.transactionRepository.getAccountOwnerId(
      existing.account_id,
    );
    assertOwnerOrAdmin(currentUser, ownerId);

    const revertEffects = this.balanceCalculator.reverseEffects(
      this.balanceCalculator.computeEffects(
        existing.type,
        existing.amount,
        existing.account_id,
        existing.to_account_id,
      ),
    );
    return this.transactionRepository.deleteTransaction(id, revertEffects);
  }

  findByAccountWithCategory(accountId: number) {
    return this.transactionRepository.findByAccountWithCategory(accountId);
  }
}
