/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ResetPageMessages = {
  title: () => _t(translations.ResetPasswordPage.title, 'Reset password'),
  description: () =>
    _t(translations.ResetPasswordPage.description, 'Reset password'),
  formTitle: () =>
    _t(translations.ResetPasswordPage.form.title, 'Reset your password'),
  newPassword: () =>
    _t(translations.ResetPasswordPage.form.newPassword.label, 'New password'),
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
      'Please input your new password',
    ),
  retypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.label,
      'Confirm password',
    ),
  retypePasswordPlaceholder: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.placeholder,
      'Confirm your new password',
    ),
  emptyPasswordRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.emptyNewPassword,
      'Please input new password first',
    ),
  invalidRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.invalid,
      'Confirm Password at least 8 characters and including letters, digits, capital characters, special characters!',
    ),
  emptyRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.empty,
      'Please confirm your new password',
    ),
  notMatchRetypePassword: () =>
    _t(
      translations.ResetPasswordPage.form.retypePassword.notMatch,
      "Your new password and confirm password don't match",
    ),
  otpLabel: () => _t(translations.ResetPasswordPage.form.otp.label, 'OTP'),
  otpPlaceholder: () =>
    _t(
      translations.ResetPasswordPage.form.otp.placeholder,
      'Input your OTP sent in your email',
    ),
  otpEmpty: () =>
    _t(translations.ResetPasswordPage.form.otp.label, 'Please input OTP'),
  resetButton: () =>
    _t(translations.ResetPasswordPage.form.resetButton, 'Reset password'),
  backtButton: () =>
    _t(translations.ResetPasswordPage.form.backButton, 'Back to login page'),
};
