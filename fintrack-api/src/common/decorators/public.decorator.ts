import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// menandai route agar dilewati oleh JwtAuthGuard global (dipakai di endpoint register/login)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
