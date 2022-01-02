import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageCodeError } from '../errors/message-code-error';
import { CaptureExceptionRequests } from '../errors/capture-exception.requests';

const logger = new Logger('MessageCodeFilter');

@Catch()
export class MessageCodeFilter implements ExceptionFilter {
  async catch(err: Error, host: ArgumentsHost): Promise<Response> {
    const res = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();
    const { name, message } = err;
    const { url } = req;

    if (err instanceof MessageCodeError) {
      /** MessageCodeError, Set all header variable to
       * have a context for the client in case of MessageCodeError. */
      if (err.httpStatus >= 500) {
        await CaptureExceptionRequests.captureException(
          { err: { ...err, url }, errorData: err.errorData, req },
        );
      }

      return res.status(err.httpStatus).send(err);
    }

    if (err instanceof HttpException) {
      const statusCode = err.getStatus() || HttpStatus.BAD_GATEWAY;
      const error = err.getResponse() as Record<string, any>;

      if (Array.isArray(error.message)) {
        const preparedMessage = [];

        for (const message of error.message) {
          const parsed = message.split(/\d\./);

          preparedMessage.push(parsed[parsed.length - 1]);
        }

        [error.message] = preparedMessage;
        error.message = error.message.replace(/_/, ' ');
      }

      if (![HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST].includes(statusCode)) {
        await CaptureExceptionRequests.captureException({ err: { ...error, url }, req });
      }

      return res.status(statusCode).send({
        error, message: error.message, httpStatus: statusCode, type: HttpException.name,
      });
    }

    const errorResponse = { path: url, name, message };

    logger.error(JSON.stringify(errorResponse));
    await CaptureExceptionRequests.captureException({ err: errorResponse, req });

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorResponse);
  }
}
