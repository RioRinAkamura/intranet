/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */

import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
  deleteModalTitle: () => _t(translations.deleteConfirmModal.title, 'Delete'),
  deleteModalDesc: () =>
    _t(
      translations.deleteConfirmModal.desc,
      'This will permanently delete and cannot be undone.',
    ),
  deleteModalAnswer: () => _t(translations.deleteConfirmModal.answer, 'DO IT'),
  deleteModalIsRequired: () =>
    _t(
      translations.deleteConfirmModal.isRequired,
      '(*) This field is required',
    ),
  deleteModalDelete: () => _t(translations.deleteConfirmModal.delete, 'Delete'),
  deleteModalCancel: () => _t(translations.deleteConfirmModal.cancel, 'Cancel'),
  deleteModalSuccess: () =>
    _t(translations.deleteConfirmModal.success, 'Delete successful'),
  deleteModalFailed: () =>
    _t(translations.deleteConfirmModal.failed, 'Delete failed'),
  deleteModalTypeEmail: () =>
    _t(
      translations.deleteConfirmModal.typeEmail,
      'Type email address below to delete your employee',
    ),
};
