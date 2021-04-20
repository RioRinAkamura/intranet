/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ForgotPageMessages = {
  title: () => _t(translations.ForgotPasswordPage.title, 'Forgot Password'),
  description: () =>
    _t(translations.ForgotPasswordPage.description, 'Forgot Password Page'),
  formTitle: () =>
    _t(translations.ForgotPasswordPage.form.title, 'Forgot Your Password'),
  formDescription: () =>
    _t(
      translations.ForgotPasswordPage.form.description,
      'Enter your registered email below to receive password reset instruction.',
    ),
  emailLabel: () =>
    _t(translations.ForgotPasswordPage.form.email.label, 'Email Address'),
  emailPlaceholder: () =>
    _t(translations.ForgotPasswordPage.form.email.placeholder, 'Your email'),
  invalidEmail: () =>
    _t(
      translations.ForgotPasswordPage.form.email.invalid,
      'Your email is invalid!',
    ),
  emptyEmail: () =>
    _t(
      translations.ForgotPasswordPage.form.email.empty,
      'Please input your email address!',
    ),
  forgotButton: () =>
    _t(translations.ForgotPasswordPage.form.forgotButton, 'Send Request'),
  backtButton: () =>
    _t(translations.ForgotPasswordPage.form.backButton, 'Back to login page'),
};
