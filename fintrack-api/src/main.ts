import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fintrack API')
    .setDescription(
      'REST API untuk mengelola user, akun (account), kategori, dan transaksi keuangan pribadi. ' +
        'Sebagian besar route butuh header `x-api` DAN JWT Bearer token (dari /auth/login atau /auth/register).',
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api', in: 'header' }, 'x-api')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
    // satu object = AND (x-api DAN jwt wajib bareng), bukan dua entry terpisah (yang berarti OR)
    .addSecurityRequirements({ 'x-api': [], jwt: [] })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
