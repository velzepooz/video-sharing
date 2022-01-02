import { errorMessagesConstants } from '../constants/error-message.constants';
import { IErrorMessages } from '../interfaces/error-message.interface';

export class MessageCodeError extends Error {
  messageCode: string;
  httpStatus: number;
  errorMessage: string;
  errorData: any;
  errorType: string;

  constructor(
    messageCode: string,
    errorBody?: string,
    errorData?: Record<string, any> | Record<string, any>[],
  ) {
    super();

    const errorMessageConfig = this.getMessageFromMessageCode(
      messageCode,
    );

    if (!errorMessageConfig) throw new Error('Unable to find message code error.');

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.httpStatus = errorMessageConfig.httpStatus;
    this.errorType = errorMessageConfig.type;
    this.messageCode = messageCode;
    this.errorMessage = errorMessageConfig.errorMessage;
    this.errorData = errorData;
  }

  /**
   * @description: Find the error config by the given message code.
   * @param {string} messageCode
   * @return {IErrorMessages}
   */
  private getMessageFromMessageCode(
    messageCode: string,
  ): IErrorMessages {
    let errorMessageConfig: IErrorMessages | undefined;

    Object.keys(errorMessagesConstants).some((key) => {
      if (key === messageCode) {
        errorMessageConfig = { ...errorMessagesConstants[key] };

        return true;
      }

      return false;
    });

    if (!errorMessageConfig) throw new Error('Unable to find the given message code error.');

    return errorMessageConfig;
  }
}
