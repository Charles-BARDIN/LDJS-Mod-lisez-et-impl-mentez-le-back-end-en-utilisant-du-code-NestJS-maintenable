import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Toutes les routes sont préfixées par /api
  app.setGlobalPrefix('api');

  // Le front-end (port 5173) appelle le back-end (port 3001)
  app.enableCors();

  // Validation automatique des DTO et suppression des champs non déclarés
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3001);
}
bootstrap();
