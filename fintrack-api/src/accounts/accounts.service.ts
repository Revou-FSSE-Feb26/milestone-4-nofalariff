import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { assertOwnerOrAdmin } from 'src/common/authorization/assert-owner';
import { Role } from 'generated/prisma/client';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepository: AccountRepository) {}

  getAllAccounts(currentUser: CurrentUserPayload) {
    const ownerId = currentUser.role === Role.Admin ? null : currentUser.id;
    return this.accountRepository.getAllAccounts(ownerId);
  }

  async getAccountById(id: number, currentUser: CurrentUserPayload) {
    const account = await this.accountRepository.getAccountById(id);
    assertOwnerOrAdmin(currentUser, account.user_id);
    return account;
  }

  createAccount(dto: CreateAccountDto, currentUser: CurrentUserPayload) {
    if (currentUser.role !== Role.Admin && dto.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'Tidak boleh membuat akun untuk user lain',
      );
    }
    return this.accountRepository.createAccount(dto);
  }

  async updateAccount(
    id: number,
    dto: UpdateAccountDto,
    currentUser: CurrentUserPayload,
  ) {
    const account = await this.accountRepository.getAccountById(id);
    assertOwnerOrAdmin(currentUser, account.user_id);
    return this.accountRepository.updateAccount(id, dto);
  }

  async deleteAccount(id: number, currentUser: CurrentUserPayload) {
    const account = await this.accountRepository.getAccountById(id);
    assertOwnerOrAdmin(currentUser, account.user_id);
    return this.accountRepository.deleteAccount(id);
  }
}
