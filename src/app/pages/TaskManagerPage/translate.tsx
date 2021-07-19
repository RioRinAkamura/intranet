/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const Messages = {
  title: () => _t(translations.Task.title, 'Task'),
  description: () => _t(translations.Task.description, 'Task'),
  createUserButton: () => _t(translations.Task.createUserButton, 'Create Task'),
  exportCSV: () => _t(translations.Task.exportCSV, 'Export as CSV'),
  exportAllUser: () => _t(translations.Task.exportAll, 'Export as CSV for all'),
  exportCSVMessage: () =>
    _t(
      translations.Task.exportCSVMessage,
      'Click link below to download the export file',
    ),
  exportPerPage: () =>
    _t(translations.Task.exportPerPage, 'Export as CSV this page'),
  exportSelected: () =>
    _t(translations.Task.exportSelected, 'Export as CSV for selected rows'),
  importCSV: () => _t(translations.Task.importCSV, 'Import CSV'),
  listEmailTitle: () => _t(translations.Task.list.email, 'Email'),
  listOptionsTitle: () => _t(translations.Task.list.options, 'Actions'),
  listViewTooltip: () => _t(translations.Task.list.viewTooltip, 'View'),
  listEditTooltip: () => _t(translations.Task.list.EditTooltip, 'Edit'),
  listDeleteTooltip: () => _t(translations.Task.list.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.Task.list.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.Task.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.Task.list.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.Task.list.filter.filterButton, 'Filter'),
  searchTitle: () => _t(translations.Task.search.title, 'Search'),
  searchLabel: () => _t(translations.Task.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.Task.search.search.placeholder,
      "Search user's first name, last name, email and phone number",
    ),
  searchSearchButton: () => _t(translations.Task.search.searchButton, 'Search'),
  searchResetButton: () => _t(translations.Task.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.Task.modal.createTitle, 'Create Task'),
  modalEditTitle: () => _t(translations.Task.modal.editTitle, 'Edit Task'),
  modalPreviewCSVTitle: () =>
    _t(translations.Task.modal.previewCSVTitle, 'Preview Import File'),
  modalFormDeleteButton: () =>
    _t(translations.Task.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.Task.modal.form.deleteContent,
      'Are you sure to delete this Task?',
    ),
  modalFormCancelButton: () =>
    _t(translations.Task.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.Task.modal.form.submitButton, 'Save'),
};
