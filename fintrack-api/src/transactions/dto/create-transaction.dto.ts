import {
  IsNumber,
  IsInt,
  IsEnum,
  IsPositive,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { TransactionType } from 'generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID akun sumber/tujuan transaksi',
    example: 1,
  })
  @IsInt()
  account_id: number;

  @ApiProperty({
    description: 'ID kategori transaksi',
    example: 1,
  })
  @IsInt()
  category_id: number;

  @ApiProperty({
    description:
      'Jenis transaksi. income menambah saldo akun, expense/transfer mengurangi saldo akun',
    enum: TransactionType,
    example: TransactionType.income,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Nominal transaksi, harus bernilai positif',
    example: 100000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Deskripsi/catatan transaksi',
    example: 'Gaji bulan Mei',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
