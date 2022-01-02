import { VideoInterface } from '../schema/video.interface';

export interface VideoRepositoryInterface {
  create(video: VideoInterface): Promise<VideoInterface>;
  deleteById(id: string): Promise<void>;
  findById(id: string): Promise<VideoInterface>;
}
