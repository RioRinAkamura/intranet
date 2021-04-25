/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const UsersMessages = {
  title: () => _t(translations.UsersPage.title, 'User Page'),
  description: () => _t(translations.UsersPage.description, 'User Page'),
  createUserButton: () =>
    _t(translations.UsersPage.createUserButton, 'Create User'),
  exportCSV: () => _t(translations.UsersPage.exportCSV, 'Export as CSV'),
  exportAllUser: () =>
    _t(translations.UsersPage.exportAllUser, 'Export as CSV for all'),
  exportPerPage: () =>
    _t(translations.UsersPage.exportPerPage, 'Export as CSV this page'),
  exportSelected: () =>
    _t(
      translations.UsersPage.exportSelected,
      'Export as CSV for selected rows',
    ),
  importCSV: () => _t(translations.UsersPage.importCSV, 'Import CSV'),
  listAvatarTitle: () => _t(translations.UsersPage.list.avatar, 'Avatar'),
  listFirstNameTitle: () =>
    _t(translations.UsersPage.list.firstName, 'First Name'),
  listLastNameTitle: () =>
    _t(translations.UsersPage.list.lastName, 'Last Name'),
  listEmailTitle: () => _t(translations.UsersPage.list.email, 'Email'),
  listOptionsTitle: () => _t(translations.UsersPage.list.options, 'Actions'),
  listViewTooltip: () => _t(translations.UsersPage.list.viewTooltip, 'View'),
  listEditTooltip: () => _t(translations.UsersPage.list.EditTooltip, 'Edit'),
  listDeleteTooltip: () =>
    _t(translations.UsersPage.list.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.UsersPage.list.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.UsersPage.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.UsersPage.list.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.UsersPage.list.filter.filterButton, 'Filter'),
  searchTitle: () => _t(translations.UsersPage.search.title, 'Search'),
  searchLabel: () => _t(translations.UsersPage.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.UsersPage.search.search.placeholder,
      "Search user's first name, last name, email and phone number",
    ),
  searchSearchButton: () =>
    _t(translations.UsersPage.search.searchButton, 'Search'),
  searchResetButton: () =>
    _t(translations.UsersPage.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.UsersPage.modal.createTitle, 'Create User'),
  modalEditTitle: () => _t(translations.UsersPage.modal.editTitle, 'Edit User'),
  modalProfileTitle: () =>
    _t(translations.UsersPage.modal.profileTitle, 'User Profile'),
  modalPreviewCSVTitle: () =>
    _t(translations.UsersPage.modal.previewCSVTitle, 'Preview Import File'),
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