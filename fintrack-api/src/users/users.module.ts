import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
