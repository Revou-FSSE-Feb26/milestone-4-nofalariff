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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiSecurity({ 'x-api': [], jwt: [] })
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Ambil semua transaksi milik user saat ini (Admin melihat semua)' })
  @ApiResponse({ status: 200, description: 'Daftar transaksi berhasil diambil' })
  @Get()
  getAllTransactions(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.transactionsService.getAllTransactions(currentUser);
  }

  @ApiOperation({ summary: 'Ambil satu transaksi berdasarkan ID (pemilik akun atau Admin)' })
  @ApiParam({ name: 'id', description: 'ID transaksi', example: 1 })
  @ApiResponse({ status: 200, description: 'Transaksi ditemukan' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'Transaksi dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getTransactionById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.transactionsService.getTransactionById(id, currentUser);
  }

  @ApiOperation({
    summary: 'Buat transaksi baru',
    description:
      'Saldo akun disesuaikan secara atomic: income menambah saldo, expense mengurangi saldo, transfer memindahkan saldo dari account_id ke to_account_id (harus akun milik user yang sama)',
  })
  @ApiResponse({ status: 201, description: 'Transaksi berhasil dibuat, saldo akun terkait ikut diperbarui' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @ApiResponse({ status: 403, description: 'account_id/to_account_id bukan milik user yang sedang login' })
  @Post()
  createTransaction(
    @Body() dto: CreateTransactionDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.transactionsService.createTransaction(dto, currentUser);
  }

  @ApiOperation({
    summary: 'Ubah transaksi berdasarkan ID',
    description:
      'Efek transaksi lama dibatalkan, lalu efek transaksi baru diterapkan (akun boleh berbeda) secara atomic',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi', example: 1 })
  @ApiResponse({ status: 200, description: 'Transaksi berhasil diubah, saldo akun terkait ikut disesuaikan' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'Transaksi dengan ID tersebut tidak ditemukan' })
  @Patch(':id')
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.transactionsService.updateTransaction(id, dto, currentUser);
  }

  @ApiOperation({
    summary: 'Hapus transaksi berdasarkan ID',
    description: 'Efek transaksi terhadap saldo akun dibatalkan (reverted) secara atomic',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi', example: 1 })
  @ApiResponse({ status: 200, description: 'Transaksi berhasil dihapus, saldo akun terkait dikembalikan' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik akun dan bukan Admin' })
  @ApiResponse({ status: 404, description: 'Transaksi dengan ID tersebut tidak ditemukan' })
  @Delete(':id')
  deleteTransaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.transactionsService.deleteTransaction(id, currentUser);
  }
}
