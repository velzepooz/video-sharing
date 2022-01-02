import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './shared/config/config.service';
import { VideoManagerModule } from './video-manager/video-manager.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { CaptureExceptionRequests } from './shared/errors/capture-exception.requests';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoDbConfig()),
    VideoManagerModule,
    AwsS3Module,
  ],
  controllers: [],
  providers: [CaptureExceptionRequests, ...configService.provideFilters()],
})
export class AppModule {}
