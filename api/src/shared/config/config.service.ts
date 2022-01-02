import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import {
  ClassProvider, HttpException, HttpStatus, INestApplication,
} from '@nestjs/common';
import * as helmet from 'helmet';
import { APP_FILTER } from '@nestjs/core';
import { ConfigServiceInterface } from './interfaces/config-service.interface';
import { ROUTES } from './routes';
import { MessageCodeFilter } from '../filters/message-code.filter';

dotenv.config({ path: 'env/.env' });

export class ConfigService implements ConfigServiceInterface {
  constructor(private env: { [k: string]: string | undefined }) {}

  ensureValues(keys: string[]): ConfigServiceInterface {
    keys.forEach((k) => this.getValue(k, true));

    return this;
  }

  getPort(): number {
    return +this.getValue('PORT', true);
  }

  getCustomKey(key: string): string {
    return this.getValue(key, true);
  }

  configureApp(app: INestApplication): void {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
    });
    app.setGlobalPrefix(ROUTES.MAIN_PATH);
    app.use(helmet());
    app.use(morgan('tiny'));
    app.use(bodyParser.json({ limit: '50mb' }));
  }

  getTelegramCredentials(): { botToken: string; roomId: string } {
    return {
      botToken: this.getValue('TELEGRAM_BOT_TOKEN'),
      roomId: this.getValue('TELEGRAM_ROOM_ID'),
    };
  }

  getMongoDbConfig(): string {
    // eslint-disable-next-line max-len
    return `mongodb://${this.getValue('MONGODB_USER')}:${this.getValue('MONGODB_PASSWORD')}@${this.getValue('MONGODB_HOST')}:${this.getValue('MONGODB_PORT')}/${this.getValue('MONGODB_DATABASE')}`;
  }

  getS3Config(): {
    config: { accessKeyId: string; secretAccessKey: string; region: string };
    } {
    return {
      config: {
        accessKeyId: this.getValue('ACCESS_KEY_ID_AWS'),
        secretAccessKey: this.getValue('SECRET_ACCESS_KEY_AWS'),
        region: this.getValue('AWS_REGION'),
      },
    };
  }

  provideFilters(): ClassProvider[] {
    return [{
      provide: APP_FILTER,
      useClass: MessageCodeFilter,
    },
    ];
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new HttpException(
        `validation:error. config error - missing env.${key}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return value;
  }
}

const configService = new ConfigService(process.env);

export { configService };
