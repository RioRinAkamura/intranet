/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */

import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  deleteModalTitle: () => _t(translations.deleteConfirmModal.title),
  deleteModalDesc: () => _t(translations.deleteConfirmModal.desc),
  deleteModalAnswer: () => _t(translations.deleteConfirmModal.answer),
  deleteModalIsRequired: () => _t(translations.deleteConfirmModal.isRequired),
  deleteModalDelete: () => _t(translations.deleteConfirmModal.delete),
  deleteModalCancel: () => _t(translations.deleteConfirmModal.cancel),
  deleteModalSuccess: () => _t(translations.deleteConfirmModal.success),
  deleteModalFailed: () => _t(translations.deleteConfirmModal.failed),
};
