import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
      'REST API untuk mengelola user, akun (account), kategori, dan transaksi keuangan pribadi.',
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api', in: 'header' }, 'x-api')
    .addSecurityRequirements('x-api') // semua route wajib header x-api (lihat AuthHeaderMiddleware)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
