import {
  IsNumber,
  IsInt,
  IsEnum,
  IsPositive,
  IsString,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from 'generated/prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID akun sumber transaksi',
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
      'Jenis transaksi. income menambah saldo akun, expense mengurangi saldo akun, transfer memindahkan saldo dari account_id ke to_account_id',
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

  @ApiPropertyOptional({
    description: 'ID akun tujuan, wajib diisi jika type = transfer',
    example: 2,
  })
  @ValidateIf((dto: CreateTransactionDto) => dto.type === 'transfer')
  @IsInt()
  to_account_id?: number;
}
