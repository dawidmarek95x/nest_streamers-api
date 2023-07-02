import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Streamer } from './entities/streamer.entity';

const APP_VERSION = '1.0.0';
const MAX_UPLOAD_SIZE = '5mb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  };

  app.enableCors(options);

  app.use(json({ limit: MAX_UPLOAD_SIZE }));
  app.use(urlencoded({ extended: true, limit: MAX_UPLOAD_SIZE }));

  const config = new DocumentBuilder()
    .setTitle('Streamers API')
    .setDescription('API used to manage streamers along with their rating')
    .setVersion(APP_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      /*
        Please keep this list ordered alphabetically.
      */
      Streamer,
    ],
  });

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
