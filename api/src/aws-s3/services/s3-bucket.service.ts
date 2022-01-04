import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';
import { HeadObjectOutput } from 'aws-sdk/clients/s3';
import * as stream from 'stream';
import { configService } from '../../shared/config/config.service';
import { MessageCodeError } from '../../shared/errors/message-code-error';

@Injectable()
export class S3BucketService {
  constructor(
    @InjectS3() private readonly s3: S3,
  ) {}

  async uploadPublicFile(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<{ fileName: string; url: string }> {
    try {
      const uploadResult = await this.s3.upload({
        ACL: 'private',
        Bucket: configService.getCustomKey('AWS_PUBLIC_BUCKET_NAME'),
        Body: fileBuffer,
        Key: `${configService.getCustomKey('S3_FOLDER_NAME')}/${fileName}`,
      }).promise();

      return { fileName: uploadResult.Key, url: uploadResult.Location };
    } catch (e) {
      throw new MessageCodeError('s3:upload', e);
    }
  }

  async deleteFile(fileName: string): Promise<any> {
    try {
      return await this.s3.deleteObjects({
        Bucket: configService.getCustomKey('AWS_PUBLIC_BUCKET_NAME'),
        Delete: {
          Objects: [{ Key: fileName }],
        },
      }).promise();
    } catch (e) {
      throw new MessageCodeError('s3:delete', e);
    }
  }

  async getFileInfo(fileName: string): Promise<HeadObjectOutput> {
    try {
      return this.s3.headObject({
        Bucket: configService.getCustomKey('AWS_PUBLIC_BUCKET_NAME'),
        Key: fileName,
      }).promise();
    } catch (e) {
      throw new MessageCodeError('s3:fileInfo', e);
    }
  }

  async getFileStream(fileName: string, range: string): Promise<stream.Readable> {
    try {
      return this.s3.getObject({
        Bucket: configService.getCustomKey('AWS_PUBLIC_BUCKET_NAME'),
        Key: fileName,
        Range: range,
      }).createReadStream();
    } catch (e) {
      throw new MessageCodeError('s3:stream', e);
    }
  }
}
