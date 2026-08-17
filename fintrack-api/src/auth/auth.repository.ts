import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // dipakai internal saat register/login, sengaja menyertakan password (hash)
  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createUser(name: string, email: string, hashedPassword: string) {
    return this.prisma.user.create({
      data: { name, email, password: hashedPassword },
      omit: { password: true },
    });
  }
}
