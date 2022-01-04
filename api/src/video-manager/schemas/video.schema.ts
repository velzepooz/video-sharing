import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { VideoInterface } from '../interfaces/schema/video.interface';
import { allowedTypes } from '../constants/video-formats.constants';

export type VideoDocument = Video & Document;

@Schema({ collection: 'videos' })
export class Video implements VideoInterface {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: true, validate: (value) => allowedTypes.includes(value) })
  fileType: string;

  @Prop({ required: true, default: Date.now })
  uploadedAt: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

export const VideoModel = {
  name: Video.name,
  schema: VideoSchema,
};
