import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';

import { ConfigService } from '@libs/infrastructures';

import { AppModule } from '@api/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();
  const configService = app.get(ConfigService);

  // config app & middlewares
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());

  // setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS REST API boilerplate')
    .setDescription('NestJS REST API boilerplate')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, swaggerDocument);

  // start listen
  await app.listen(configService.app.port);

  logger.log(`==========================================================`);
  logger.log(`[${configService.app.env}] Server running on ${await app.getUrl()}`);
  logger.log(`==========================================================`);
}

bootstrap();
