import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModel } from './schemas/video.schema';
import { VideoManagerController } from './controllers/video-manager.controller';
import { VideoManagerService } from './services/video-manager.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { VideoRepository } from './repository/video.repository';

@Module({
  imports: [MongooseModule.forFeature([VideoModel]), AwsS3Module],
  controllers: [VideoManagerController],
  providers: [VideoManagerService, VideoRepository],
})
export class VideoManagerModule {}
