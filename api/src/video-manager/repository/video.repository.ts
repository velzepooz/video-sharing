import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '../schemas/video.schema';
import { VideoInterface } from '../interfaces/schema/video.interface';
import { VideoRepositoryInterface } from '../interfaces/repository/video-repository.interface';

@Injectable()
export class VideoRepository implements VideoRepositoryInterface {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async create(video: VideoInterface): Promise<VideoInterface> {
    return this.videoModel.create(video);
  }

  async findById(id: string): Promise<VideoInterface> {
    return this.videoModel.findById(id);
  }

  async deleteById(id: string): Promise<void> {
    await this.videoModel.deleteOne({ _id: id });
  }

  async getAllVideos(): Promise<VideoInterface[]> {
    return this.videoModel.find();
  }
}
