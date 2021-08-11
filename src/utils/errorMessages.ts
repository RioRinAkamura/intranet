import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export interface ErrorType {
  code: number;
  message: string;
  status_code: number;
  summary: string;
}

export const errorMess = {
  400: () => _t(translations.Errors.error400, 'Bad Request'),
  401: () => _t(translations.Errors.error401, 'Unauthorized'),
  403: () => _t(translations.Errors.error403, 'Forbidden'),
  404: () => _t(translations.Errors.error404, 'Not Found'),
  500: () => _t(translations.Errors.error500, 'Internal Server Error'),
};

export const mapErrorCode = (error: ErrorType) => {
  if (error) {
    const { code, message } = error;
    return errorMess[code] ? errorMess[code] : message;
  }
};
