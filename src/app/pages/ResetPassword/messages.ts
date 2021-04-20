/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ResetPageMessages = {
  title: () => _t(translations.ResetPasswordPage.title, 'Reset Password'),
  description: () =>
    _t(translations.ResetPasswordPage.description, 'Reset Password Page'),
  formTitle: () =>
    _t(translations.ResetPasswordPage.form.title, 'Reset Your Password'),
  newPassword: () =>
    _t(translations.ResetPasswordPage.form.newPassword.label, 'New Password'),
  newPasswordPlaceholder: () =>
    _t(
      translations.ResetPasswordPage.form.newPassword.placeholder,
      'Input your new password',
    ),
  invalidNewPassword: () =>
    _t(
      translations.ResetPasswordPage.form.newPassword.invalid,
      'Password at least 8 characters and including letters, digits, capital characters, special characters!',
    ),
  emptyNewPassword: () =>
    _t(
      translations.ResetPasswordPage.form.newPassword.empty,
      'Please input your new password!',
    ),
  retypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.label,
      'Confirm Password',
    ),
  retypePasswordPlaceholder: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.placeholder,
      'Confirm your new password',
    ),
  emptyPasswordRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.emptyNewPassword,
      'Please input new password first!',
    ),
  invalidRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.invalid,
      'Confirm Password at least 8 characters and including letters, digits, capital characters, special characters!',
    ),
  emptyRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.empty,
      'Please confirm your new password!',
    ),
  notMatchRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.notMatch,
      "Your new password and confirm password don't match!",
    ),
  resetButton: () =>
    _t(translations.ResetPasswordPage.form.resetButton, 'Reset Password'),
  backtButton: () =>
    _t(translations.ResetPasswordPage.form.backButton, 'Back to login page'),
};
