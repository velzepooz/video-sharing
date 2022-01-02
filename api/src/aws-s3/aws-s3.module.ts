import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { S3BucketService } from './services/s3-bucket.service';
import { configService } from '../shared/config/config.service';

@Module({
  imports: [
    S3Module.forRoot(configService.getS3Config()),
  ],
  controllers: [],
  exports: [S3BucketService],
  providers: [S3BucketService],
})
export class AwsS3Module {}
