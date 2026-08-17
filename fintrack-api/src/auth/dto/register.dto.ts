import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nama lengkap user', example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Alamat email, harus unik', example: 'budi@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password, minimal 6 karakter', example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
