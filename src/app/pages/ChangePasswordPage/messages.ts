/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */

import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  changePasswordButton: () => _t(translations.changPassword.changePasswordButton),
  changePasswordCancle: () => _t(translations.changPassword.cancleChangePasswordButton),
  changePasswordOld: () => _t(translations.changPassword.oldPassword),
  changePasswordNew: () => _t(translations.changPassword.newPassword),
  changePasswordRetype: () => _t(translations.changPassword.retypePassword),
  changePasswordIsRequired: () => _t(translations.changPassword.isRequired),
  changePasswordMinLength: () => _t(translations.changPassword.minLength),
  changePasswordComplexPassword: () => _t(translations.changPassword.complexPassword),
  changePasswordIsNotMatch: () => _t(translations.changPassword.isNotMatch),
};
