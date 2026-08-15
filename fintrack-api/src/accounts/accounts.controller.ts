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
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @ApiOperation({ summary: 'Ambil semua akun' })
  @ApiResponse({ status: 200, description: 'Daftar akun berhasil diambil' })
  @Get()
  getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @ApiOperation({ summary: 'Ambil satu akun berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Akun ditemukan' })
  @ApiResponse({ status: 404, description: 'Akun dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getAccountById(id);
  }

  @ApiOperation({ summary: 'Buat akun baru untuk seorang user' })
  @ApiResponse({ status: 201, description: 'Akun berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @Post()
  createAccount(@Body() dto: CreateAccountDto) {
    return this.accountsService.createAccount(dto);
  }

  @ApiOperation({ summary: 'Ubah data akun berdasarkan ID (kecuali pemilik/user_id)' })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Akun berhasil diubah' })
  @ApiResponse({ status: 404, description: 'Akun dengan ID tersebut tidak ditemukan' })
  @Patch(':id')
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(id, dto);
  }

  @ApiOperation({ summary: 'Hapus akun berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Akun berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Akun dengan ID tersebut tidak ditemukan' })
  @Delete(':id')
  deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.deleteAccount(id);
  }

  @ApiOperation({
    summary: 'Ambil semua transaksi milik satu akun beserta kategorinya',
    description:
      'Diurutkan berdasarkan transaction_date terbaru, setiap transaksi menyertakan relasi category',
  })
  @ApiParam({ name: 'id', description: 'ID akun', example: 1 })
  @ApiResponse({ status: 200, description: 'Daftar transaksi berhasil diambil' })
  @Get(':id/transactions')
  getTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findByAccountWithCategory(id);
  }
}
