/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const Messages = {
  title: () => _t(translations.LeaveApplication.title, 'Leave applications'),
  description: () =>
    _t(translations.LeaveApplication.description, 'Leave applications'),
  createUserButton: () =>
    _t(
      translations.LeaveApplication.createUserButton,
      'Create leave application',
    ),
  exportCSV: () => _t(translations.LeaveApplication.exportCSV, 'Export as CSV'),
  exportAllUser: () =>
    _t(translations.LeaveApplication.exportAll, 'Export as CSV for all'),
  exportCSVMessage: () =>
    _t(
      translations.LeaveApplication.exportCSVMessage,
      'Click link below to download the export file',
    ),
  exportPerPage: () =>
    _t(translations.LeaveApplication.exportPerPage, 'Export as CSV this page'),
  exportSelected: () =>
    _t(
      translations.LeaveApplication.exportSelected,
      'Export as CSV for selected rows',
    ),
  importCSV: () => _t(translations.LeaveApplication.importCSV, 'Import CSV'),
  listEmailTitle: () => _t(translations.LeaveApplication.list.email, 'Email'),
  listOptionsTitle: () =>
    _t(translations.LeaveApplication.list.options, 'Actions'),
  listViewTooltip: () =>
    _t(translations.LeaveApplication.list.viewTooltip, 'View'),
  listEditTooltip: () =>
    _t(translations.LeaveApplication.list.EditTooltip, 'Edit'),
  listDeleteTooltip: () =>
    _t(translations.LeaveApplication.list.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.LeaveApplication.list.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.LeaveApplication.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.LeaveApplication.list.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.LeaveApplication.list.filter.filterButton, 'Filter'),
  searchTitle: () => _t(translations.LeaveApplication.search.title, 'Search'),
  searchLabel: () =>
    _t(translations.LeaveApplication.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.LeaveApplication.search.search.placeholder,
      "Search user's first name, last name, email and phone number",
    ),
  searchSearchButton: () =>
    _t(translations.LeaveApplication.search.searchButton, 'Search'),
  searchResetButton: () =>
    _t(translations.LeaveApplication.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.LeaveApplication.modal.createTitle, 'Create employee'),
  modalEditTitle: () =>
    _t(translations.LeaveApplication.modal.editTitle, 'Edit employee'),
  modalPreviewCSVTitle: () =>
    _t(
      translations.LeaveApplication.modal.previewCSVTitle,
      'Preview import file',
    ),
  modalFormDeleteButton: () =>
    _t(translations.LeaveApplication.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.LeaveApplication.modal.form.deleteContent,
      'Are you sure to delete this user?',
    ),
  modalFormCancelButton: () =>
    _t(translations.LeaveApplication.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.LeaveApplication.modal.form.submitButton, 'Save'),
};
