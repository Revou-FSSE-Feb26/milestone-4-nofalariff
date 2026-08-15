import { IsInt, IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { AccountType } from 'generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'ID user pemilik akun',
    example: 1,
  })
  @IsInt()
  user_id: number;

  @ApiProperty({
    description: 'Nama akun',
    example: 'BCA Utama',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Jenis akun',
    enum: AccountType,
    example: AccountType.bank,
  })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({
    description: 'Saldo awal akun',
    example: 0,
  })
  @IsNumber()
  balance: number;
}
