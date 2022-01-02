import { ClassProvider, INestApplication } from '@nestjs/common';

export interface ConfigServiceInterface {
  ensureValues(keys: string[]): ConfigServiceInterface;
  getPort(): number;
  getCustomKey(key: string): string;
  configureApp(app: INestApplication): void;
  getTelegramCredentials(): { botToken: string; roomId: string };
  provideFilters(): ClassProvider[];
  getS3Config(): {
    config: { accessKeyId: string; secretAccessKey: string; region: string };
  };
  getMongoDbConfig(): string;
}
