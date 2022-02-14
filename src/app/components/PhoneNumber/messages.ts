/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */

import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  phoneInputValidate: () =>
    _t(translations.phoneNumberInput.validate, 'Please input more 1 word'),
  phoneInputSearchSkills: () =>
    _t(
      translations.phoneNumberInput.searchPhoneNumber,
      'Search phone number...',
    ),
};
