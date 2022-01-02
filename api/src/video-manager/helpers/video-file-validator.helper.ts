import { RequestInterface } from '../../shared/interfaces/request.interface';
import { FileInterface } from '../../shared/interfaces/file.interface';
import { allowedMimeTypes, allowedTypes } from '../constants/video-formats.constants';
import { MessageCodeError } from '../../shared/errors/message-code-error';

export const videoFileValidator = (req: RequestInterface, file: FileInterface, callback) => {
  const fileExtension = getExtension(file.originalname);

  if (!allowedTypes.includes(fileExtension) || !allowedMimeTypes.includes(file.mimetype)) {
    callback(new MessageCodeError('video:badFormat'), false);
  }

  callback(null, true);
};

function getExtension(filename): string {
  return filename.split('.').pop();
}
