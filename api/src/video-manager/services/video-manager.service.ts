import { Injectable } from '@nestjs/common';
import { S3BucketService } from '../../aws-s3/services/s3-bucket.service';
import { VideoRepository } from '../repository/video.repository';
import { VideoInterface } from '../interfaces/schema/video.interface';
import { MessageCodeError } from '../../shared/errors/message-code-error';

@Injectable()
export class VideoManagerService {
  constructor(
    private readonly _s3BucketService: S3BucketService,
    private readonly _videoRepository: VideoRepository,
  ) {
  }

  async uploadNewVideo(fileBuffer: Buffer, fileName: string): Promise<VideoInterface> {
    const originalName = fileName.split('.');
    const result = await this._s3BucketService.uploadPublicFile(
      fileBuffer,
      originalName.slice(0, -1).join(''),
    );

    return this._videoRepository.create({
      videoUrl: result.url,
      name: result.fileName,
      fileType: originalName[originalName.length - 1],
    });
  }

  async deleteVideo(id: string): Promise<void> {
    const videoFile = await this._videoRepository.findById(id);

    if (!videoFile) throw new MessageCodeError('video:notFound');

    await this._s3BucketService.deleteFile(videoFile.name);
    await this._videoRepository.deleteById(id);
  }

  async getVideoStream(id: string): Promise<any> {
    const videoFile = await this._videoRepository.findById(id);

    if (!videoFile) throw new MessageCodeError('video:notFound');

    const fileInfo = await this._s3BucketService.getFileInfo(videoFile.name);
    const fileStream = await this._s3BucketService.getFileStream(videoFile.name);

    return {
      size: fileInfo.ContentLength,
      type: videoFile.fileType,
      stream: fileStream,
    };
  }

  async getAllVideos(): Promise<VideoInterface[]> {
    return this._videoRepository.getAllVideos();
  }
}
