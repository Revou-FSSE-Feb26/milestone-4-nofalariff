import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthHeaderMiddleware } from './common/middleware/auth-hearder';
import { ConfigModule } from '@nestjs/config';
import { MaintenanceMiddleware } from './common/middleware/maintenance.middleware';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MaintenanceMiddleware, LoggerMiddleware, AuthHeaderMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
