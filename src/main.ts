import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GqlGlobalExceptionsFilter } from '@ultraos/common/dist/public/filter/gqlexception.filter';
import { ParamValidationExceptionFactory } from '@ultraos/common/dist/public/exception/param.validation.exception.factory';
import { UltraLogger } from '@ultraos/common/dist/public/logging/logger.logging';
import { NestLogger } from '@ultraos/common/dist/public/logging/nest.logging';
import { EnvironmentProcessor } from '@ultraos/common/dist/public/utils/environment.processor';
import * as mongoose from 'mongoose';
import { AppModule } from './app.module';

EnvironmentProcessor.envChecker([
  'appPort',
  'appGlobalPrefix',
  'dbUser',
  'dbPassword',
  'dbHost',
  'dbName',
  'jwtSecretKey',
  'jwtEncryptionKey',
  'consoleLogLevel',
  'logFormat',
  'runningEnvironment',
  'performanceLogEnabled',
  'mongooseDebug',
  'enableCORS',
  'kafkaUrl',
  'useKafkaWithSSL',
  'kafkaConsumerDBCollectionName',
  'serviceId',
  'graphqlPlayground',
  'graphqlDebug',
]);

/**
 * Enables the debugging of the database queries if specified by the application properties.
 */
function enableMongooseDebugging() {
  const mongoDebugEnabled: boolean = process.env.mongooseDebug ? JSON.parse(process.env.mongooseDebug) : false;

  if (mongoDebugEnabled) {
    UltraLogger.info('Main', ['Enabling database queries logging...']);
    mongoose.set('debug', true);
  } else {
    UltraLogger.info('Main', ['Database queries logging is disabled']);
  }
}

async function bootstrap() {
  const cors: boolean = process.env.enableCORS ? JSON.parse(process.env.enableCORS) : false;
  if (cors) {
    UltraLogger.warn('Main', ['CORS is enabled on the server.']);
  }

  const app: INestApplication = await NestFactory.create(AppModule, { cors });
  app.useLogger(new NestLogger());
  app.useGlobalFilters(new GqlGlobalExceptionsFilter());
  app.setGlobalPrefix(process.env.appGlobalPrefix!);
  app.useGlobalPipes(
    new ValidationPipe({ exceptionFactory: new ParamValidationExceptionFactory().createExceptionFactory() }),
  );

  enableMongooseDebugging();

  UltraLogger.info('Main', [`The application is launching on port `, process.env.appPort]);

  await app.listen(process.env.appPort!);
}

bootstrap();
