import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // Menambahkan prefix /api/v1 ke semua router pada controller
  app.setGlobalPrefix('/api/v1');

  await app.listen(3000);
  console.log('Server Running on port 3000');
}
bootstrap();
