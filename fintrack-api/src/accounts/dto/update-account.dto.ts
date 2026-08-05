import { CreateAccountDto } from './create-account.dto';
import { PartialType, OmitType } from '@nestjs/mapped-types';

// MENGGUNAKAN OMIT TYPE UNTUK MENGHAPUS FIELD USER_ID DARI CREATEACCOUNTDTO DAN MENGGUNAKAN PARTIALTYPE UNTUK MEMBUAT SEMUA FIELD MENJADI OPSIONAL
export class UpdateAccountDto extends PartialType(
  OmitType(CreateAccountDto, ['user_id'] as const),
) {}
