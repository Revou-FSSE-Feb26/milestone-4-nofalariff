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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@ApiTags('Accounts')
@ApiSecurity({ 'x-api': [], jwt: [] })
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @ApiOperation({ summary: 'Ambil semua akun milik user saat ini (Admin melihat semua)' })
  @ApiResponse({ status: 200, description: 'Daftar akun berhasil diambil' })
  @Get()
  getAllAccounts(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.accountsService.getAllAccounts(currentUser);
  }

  @ApiOperation({ summary: 'Ambil satu akun berdasarkan ID (pemilik atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Akun ditemukan' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'Akun dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getAccountById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.accountsService.getAccountById(id, currentUser);
  }

  @ApiOperation({
    summary: 'Buat akun baru untuk diri sendiri',
    description: 'user_id pada body wajib sama dengan user yang sedang login, kecuali Admin',
  })
  @ApiResponse({ status: 201, description: 'Akun berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @ApiResponse({ status: 403, description: 'Mencoba membuat akun untuk user_id milik orang lain' })
  @Post()
  createAccount(
    @Body() dto: CreateAccountDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.accountsService.createAccount(dto, currentUser);
  }

  @ApiOperation({ summary: 'Ubah data akun berdasarkan ID (pemilik atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Akun berhasil diubah' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'Akun dengan ID tersebut tidak ditemukan' })
  @Patch(':id')
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.accountsService.updateAccount(id, dto, currentUser);
  }

  @ApiOperation({ summary: 'Hapus akun berdasarkan ID (pemilik atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Akun berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'Akun dengan ID tersebut tidak ditemukan' })
  @Delete(':id')
  deleteAccount(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.accountsService.deleteAccount(id, currentUser);
  }

  @ApiOperation({
    summary: 'Ambil semua transaksi milik satu akun beserta kategorinya (pemilik atau Admin)',
    description:
      'Diurutkan berdasarkan transaction_date terbaru, setiap transaksi menyertakan relasi category',
  })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Daftar transaksi berhasil diambil' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @Get(':id/transactions')
  async getTransactions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    await this.accountsService.getAccountById(id, currentUser); // sekaligus validasi ownership
    return this.transactionsService.findByAccountWithCategory(id);
  }
}
