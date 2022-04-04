/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const EmployeeTimesheetMessage = {
  title: () => _t(translations.UsersPage.title, 'Employees'),
  description: () => _t(translations.UsersPage.description, 'Employees'),
  filterSearchButton: () =>
    _t(translations.UsersPage.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.UsersPage.list.filter.resetButton, 'Reset'),
  modalFormDeleteButton: () =>
    _t(translations.UsersPage.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.UsersPage.modal.form.deleteContent,
      'Are you sure to delete this user?',
    ),
  modalFormCancelButton: () =>
    _t(translations.UsersPage.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.UsersPage.modal.form.submitButton, 'Save'),
};
