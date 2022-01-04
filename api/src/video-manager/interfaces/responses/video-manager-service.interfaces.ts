import * as stream from 'stream';

export interface GetVideoStreamInterface {
  size: number;
  type: string;
  stream: stream.Readable;
}
