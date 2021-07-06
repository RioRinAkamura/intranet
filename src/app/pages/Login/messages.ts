/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const LoginMessages = {
  title: () => _t(translations.LoginPage.title, 'Login'),
  description: () => _t(translations.LoginPage.description, 'Login'),
  formTitle: () => _t(translations.LoginPage.form.title, 'Login'),
  email: () => _t(translations.LoginPage.form.email, 'Email address'),
  invalidEmail: () =>
    _t(translations.LoginPage.form.invalidEmail, 'Your email is invalid'),
  emptyEmail: () =>
    _t(
      translations.LoginPage.form.emptyEmail,
      'Please input your email address',
    ),
  password: () => _t(translations.LoginPage.form.password, 'Password'),
  emptyPassword: () =>
    _t(
      translations.LoginPage.form.emptyPassword,
      'Please input your password!',
    ),
  rememberMe: () => _t(translations.LoginPage.form.rememberMe, 'Remember me'),
  forgotPassword: () =>
    _t(translations.LoginPage.form.forgotPassword, 'Forgot your password'),
  loginButton: () => _t(translations.LoginPage.form.loginButton, 'Login'),
  registerLinkText: () =>
    _t(translations.LoginPage.form.registerLinkText, 'Register now'),
  loginFacebookButton: () =>
    _t(translations.LoginPage.form.loginFacebookButton, 'Login with Facebook'),
  loginGoogleButton: () =>
    _t(translations.LoginPage.form.loginGoogleButton, 'Login with Google'),
  dividerText: () => _t(translations.LoginPage.form.dividerText, 'Or'),
};
