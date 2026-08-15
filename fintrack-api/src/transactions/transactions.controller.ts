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
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Ambil semua transaksi' })
  @ApiResponse({ status: 200, description: 'Daftar transaksi berhasil diambil' })
  @Get()
  getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @ApiOperation({ summary: 'Ambil satu transaksi berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID transaksi', example: 1 })
  @ApiResponse({ status: 200, description: 'Transaksi ditemukan' })
  @ApiResponse({ status: 404, description: 'Transaksi dengan ID tersebut tidak ditemukan' })
  @Get(':id')
  getTransactionById(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.getTransactionById(id);
  }

  @ApiOperation({
    summary: 'Buat transaksi baru',
    description:
      'Saldo akun (account_id) otomatis disesuaikan secara atomic: income menambah saldo, expense/transfer mengurangi saldo',
  })
  @ApiResponse({ status: 201, description: 'Transaksi berhasil dibuat, saldo akun terkait ikut diperbarui' })
  @ApiResponse({ status: 400, description: 'Payload tidak valid' })
  @Post()
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  @ApiOperation({
    summary: 'Ubah transaksi berdasarkan ID',
    description:
      'Efek transaksi lama terhadap saldo akun lama dibatalkan, lalu efek transaksi baru diterapkan ke akun (baru atau sama) secara atomic',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi', example: 1 })
  @ApiResponse({ status: 200, description: 'Transaksi berhasil diubah, saldo akun terkait ikut disesuaikan' })
  @ApiResponse({ status: 404, description: 'Transaksi dengan ID tersebut tidak ditemukan' })
  @Patch(':id')
  updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(id, dto);
  }

  @ApiOperation({
    summary: 'Hapus transaksi berdasarkan ID',
    description: 'Efek transaksi terhadap saldo akun dibatalkan (reverted) secara atomic',
  })
  @ApiParam({ name: 'id', description: 'ID transaksi', example: 1 })
  @ApiResponse({ status: 200, description: 'Transaksi berhasil dihapus, saldo akun terkait dikembalikan' })
  @ApiResponse({ status: 404, description: 'Transaksi dengan ID tersebut tidak ditemukan' })
  @Delete(':id')
  deleteTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.deleteTransaction(id);
  }
}
