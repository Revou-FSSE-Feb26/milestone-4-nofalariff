import { ForbiddenException } from '@nestjs/common';
import { CurrentUserPayload } from '../decorators/current-user.decorator';
import { Role } from 'generated/prisma/client';

// dipakai di service layer (Users/Accounts/Transactions) untuk enforce
// bahwa user hanya boleh akses resource miliknya sendiri, kecuali Admin
export function assertOwnerOrAdmin(
  currentUser: CurrentUserPayload,
  ownerId: number,
) {
  if (currentUser.role !== Role.Admin && currentUser.id !== ownerId) {
    throw new ForbiddenException(
      'Anda tidak berhak mengakses resource milik user lain',
    );
  }
}
