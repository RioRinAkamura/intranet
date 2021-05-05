/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */

import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  changePasswordTitle: () =>
    _t(translations.changPassword.title, 'Change Password'),
  changePasswordCancel: () => _t(translations.changPassword.cancel, 'Cancel'),
  changePasswordOld: () =>
    _t(translations.changPassword.oldPassword, 'Old Password'),
  changePasswordNew: () =>
    _t(translations.changPassword.newPassword, 'New Password'),
  changePasswordRetype: () =>
    _t(translations.changPassword.retypePassword, 'Confirm Password'),
  changePasswordIsRequired: () =>
    _t(translations.changPassword.isRequired, '(*) This field is required'),
  changePasswordMinLength: () =>
    _t(translations.changPassword.minLength, '(*) Min length 8'),
  changePasswordComplexPassword: () =>
    _t(translations.changPassword.complexPassword, 'complexPassword'),
  changePasswordIsNotMatch: () =>
    _t(
      translations.changPassword.isNotMatch,
      '(*) The two passwords that you entered do not match!',
    ),
  changePasswordSuccess: () =>
    _t(translations.changPassword.changePassSuccess, 'Change password success'),
  changePasswordFailed: () =>
    _t(translations.changPassword.changePassFailed, 'Change password failed'),
  changePasswordWrongOld: () =>
    _t(translations.changPassword.wrongOldPassword, 'Wrong Old Password'),
  changePasswordInputOld: () =>
    _t(
      translations.changPassword.inputOldPassword,
      'Please input old password!',
    ),
  changePasswordInputNew: () =>
    _t(
      translations.changPassword.inputNewPassword,
      'Please input new password!',
    ),
  changePasswordInputRetype: () =>
    _t(
      translations.changPassword.inputRetypePassword,
      'Please input retype password!',
    ),
};
