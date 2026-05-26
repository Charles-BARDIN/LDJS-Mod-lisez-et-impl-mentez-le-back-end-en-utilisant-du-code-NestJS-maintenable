import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Toutes les routes sont préfixées par /api
  app.setGlobalPrefix('api');

  // Le front-end (port 5173) appelle le back-end (port 3001)
  app.enableCors();

  // Validation automatique des DTO et suppression des champs non déclarés
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Réponses d'erreur uniformisées au format { message }
  app.useGlobalFilters(new HttpExceptionFilter());

  // Documentation OpenAPI (Swagger), accessible sans authentification.
  // Le bouton « Authorize » permet de tester les routes protégées avec un token JWT.
  const config = new DocumentBuilder()
    .setTitle('ChâTop API')
    .setDescription("API REST de l'application de location saisonnière ChâTop")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
}
void bootstrap();
