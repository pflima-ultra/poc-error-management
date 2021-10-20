import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { EventE2EModule } from '@ultraos/common-test/dist/event/event.e2e-helper.module';
import { BrokerE2E } from '@ultraos/common-test/dist/broker/broker.e2e-helper';
import { GqlGlobalExceptionsFilter } from '@ultraos/common/dist/public/filter/gqlexception.filter';
import { Axios } from '@ultraos/common/dist/public/http/http.axios';
import { UltraLogger } from '@ultraos/common/dist/public/logging/logger.logging';
import { NestLogger } from '@ultraos/common/dist/public/logging/nest.logging';
import { EnvironmentProcessor } from '@ultraos/common/dist/public/utils/environment.processor';
import MockAdapter from 'axios-mock-adapter';
import * as MongoClient from 'mongodb';
import * as mongoose from 'mongoose';
import { AppModule } from '../../../src/app.module';
import { BrokerE2EModule } from '@ultraos/common-test/dist/broker/broker.e2e-helper.module';

const APP_PREFIX: string = process.env.appGlobalPrefix!;

/**
 * Helper for e2e tests
 */
export class E2eHelper {
  /**
   * Check mandatory properties to use, initialise database and http mock
   */
  async initTest(collectionName?: string): Promise<TestInitConfig> {
    // Check required properties of .env file
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

    // needs to place before Test.createTestingModule
    const mock = new MockAdapter(Axios);
    const module: TestingModule = await EventE2EModule.createTestingModule({
      imports: [AppModule, BrokerE2EModule],
    }).compile();
    const application = module.createNestApplication();
    application.useLogger(new NestLogger());
    const brokerE2E: BrokerE2E = module.get(BrokerE2E);

    application.setGlobalPrefix(APP_PREFIX).useGlobalFilters(new GqlGlobalExceptionsFilter());
    mongoose.set('debug', true);

    const urlMongo: string = `mongodb://${process.env.dbUser}:${process.env.dbPassword}@${process.env.dbHost!.substr(
      10,
    )}`;
    UltraLogger.info(E2eHelper.name, ['Database mongodb URL connection: ', urlMongo]);

    const connection = await MongoClient.connect(urlMongo, { useNewUrlParser: true, useUnifiedTopology: true });
    const database = connection.db(process.env.dbName!);
    const collection = collectionName ? database.collection(collectionName) : undefined;

    return new TestInitConfig(module, application, connection, database, brokerE2E, collection, mock);
  }
}

export class TestInitConfig {
  private _module: TestingModule;
  private _application: INestApplication;
  private _connection: any;
  private _database: any;
  private _collection?: any;
  private _mock?: MockAdapter;
  private _brokerE2E: BrokerE2E;

  constructor(
    module: TestingModule,
    application: INestApplication,
    connection: any,
    database: any,
    brokerE2E: BrokerE2E,
    collection?: any,
    mock?: MockAdapter,
  ) {
    this._module = module;
    this._application = application;
    this._connection = connection;
    this._database = database;
    this._brokerE2E = brokerE2E;
    this._collection = collection;
    this._mock = mock;
  }

  get module(): TestingModule {
    return this._module;
  }

  get application(): INestApplication {
    return this._application;
  }

  get connection(): any {
    return this._connection;
  }

  get database(): any {
    return this._database;
  }

  get collection(): any {
    return this._collection;
  }

  get mock(): any {
    return this._mock;
  }

  get brokerE2E(): BrokerE2E {
    return this._brokerE2E;
  }
}

export async function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}
