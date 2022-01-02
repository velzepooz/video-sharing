import { VideoInterface } from '../../interfaces/schema/video.interface';

export class VideoDto implements VideoInterface {
  _id?: string;
  name: string;
  videoUrl: string;
  uploadedAt?: Date;
}
