import { HttpStatus } from '@nestjs/common';
import { IErrorMessages } from '../interfaces/error-message.interface';

export const errorMessagesConstants: {
  [messageCode: string]: IErrorMessages;
} = {
  /** Video errors */
  'video:notFound': {
    type: 'Not Found',
    httpStatus: HttpStatus.NOT_FOUND,
    errorMessage: '',
  },
  'video:badFormat': {
    type: 'Bad Request',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Not allowed file format',
  },
  /** S3 */
  's3:upload': {
    type: 'Bad Gateway',
    httpStatus: HttpStatus.BAD_GATEWAY,
    errorMessage: 'Failed to upload file',
  },
  's3:delete': {
    type: 'Bad Gateway',
    httpStatus: HttpStatus.BAD_GATEWAY,
    errorMessage: 'Failed to delete file',
  },
  's3:stream': {
    type: 'Bad Gateway',
    httpStatus: HttpStatus.BAD_GATEWAY,
    errorMessage: 'Failed to stream file',
  },
  's3:fileInfo': {
    type: 'Bad Gateway',
    httpStatus: HttpStatus.BAD_GATEWAY,
    errorMessage: 'Failed to get file info',
  },
};
