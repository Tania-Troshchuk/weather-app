import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import AppDataSource from '../data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   methods: 'GET, POST',
  // });

  app.setGlobalPrefix('api');
  // app.enableCors({
  //   origin: true, // Allow all origins in development
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
