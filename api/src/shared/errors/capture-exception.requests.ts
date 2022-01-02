// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { configService } from '../config/config.service';
import { IErrorMessages } from '../interfaces/error-message.interface';
import { RequestInterface } from '../interfaces/request.interface';

type captureExceptionParams = {
  err: Error|Record<string, any>|string;
  errorData?: IErrorMessages;
  req?: RequestInterface;
};
const logger = new Logger('CaptureExceptionRequests');

export class CaptureExceptionRequests {
  static async captureException({ err, errorData, req }: captureExceptionParams): Promise<void> {

    const { botToken, roomId } = configService.getTelegramCredentials();
    const message = `Some error in ${configService.getCustomKey('NODE_ENV')},
        on video service api,
        ${errorData ? `errorData: ${JSON.stringify(errorData)}` : ''}
        url:${req?.url},
        req headers: ${req.headers ? JSON.stringify(req.headers) : ''},
        req query: ${req.query ? JSON.stringify(req.query) : ''},
        req body: ${req.body ? JSON.stringify(req.body) : ''},
        status: ${err?.status || ''}
        request failed with error: ${JSON.stringify(err)}`.slice(0, 4090);
    const url = encodeURI(
      `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${roomId}&text=${message}`,
    );

    try {
      await axios.get(url);
    } catch (e) {
      logger.error(e.message);
    }
  }
}
