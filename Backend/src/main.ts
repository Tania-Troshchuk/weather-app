import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import AppDataSource from '../data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  app.setGlobalPrefix('api');
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   methods: 'GET, POST',
  // });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
}

bootstrap();
