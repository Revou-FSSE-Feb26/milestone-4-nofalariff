import { IsInt, IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { AccountType } from 'generated/prisma/client';

export class CreateAccountDto {
  @IsInt()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsNumber()
  balance: number;
}
