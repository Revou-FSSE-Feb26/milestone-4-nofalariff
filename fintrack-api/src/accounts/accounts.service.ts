import { AccountRepository } from './repositories/account.repository';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepository: AccountRepository) {}

  getAllAccounts() {
    return this.accountRepository.getAllAccounts();
  }

  getAccountById(id: number) {
    return this.accountRepository.getAccountById(id);
  }

  createAccount(dto: CreateAccountDto) {
    return this.accountRepository.createAccount(dto);
  }

  updateAccount(id: number, dto: UpdateAccountDto) {
    return this.accountRepository.updateAccount(id, dto);
  }

  deleteAccount(id: number) {
    return this.accountRepository.deleteAccount(id);
  }
}
