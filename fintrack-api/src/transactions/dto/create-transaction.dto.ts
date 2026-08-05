import {
  IsNumber,
  IsInt,
  IsEnum,
  IsPositive,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { TransactionType } from 'generated/prisma/client';

export class CreateTransactionDto {
  @IsInt()
  account_id: number;

  @IsInt()
  category_id: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
