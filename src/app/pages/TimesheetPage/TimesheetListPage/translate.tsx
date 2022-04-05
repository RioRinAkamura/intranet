/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const Messages = {
  title: () => _t(translations.Timesheets.title, 'Timesheets'),
  description: () => _t(translations.Timesheets.description, 'Timesheets'),
  createUserButton: () =>
    _t(translations.Timesheets.createUserButton, 'Create Timesheets'),
  exportCSV: () => _t(translations.Timesheets.exportCSV, 'Export as CSV'),
  exportAllUser: () =>
    _t(translations.Timesheets.exportAll, 'Export as CSV for all'),
  exportCSVMessage: () =>
    _t(
      translations.Timesheets.exportCSVMessage,
      'Click link below to download the export file',
    ),
  exportPerPage: () =>
    _t(translations.Timesheets.exportPerPage, 'Export as CSV this page'),
  exportSelected: () =>
    _t(
      translations.Timesheets.exportSelected,
      'Export as CSV for selected rows',
    ),
  importCSV: () => _t(translations.Timesheets.importCSV, 'Import CSV'),
  listEmailTitle: () => _t(translations.Timesheets.list.email, 'Email'),
  listOptionsTitle: () => _t(translations.Timesheets.list.options, 'Actions'),
  listViewTooltip: () => _t(translations.Timesheets.list.viewTooltip, 'View'),
  listEditTooltip: () => _t(translations.Timesheets.list.EditTooltip, 'Edit'),
  listDeleteTooltip: () =>
    _t(translations.Timesheets.list.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.Timesheets.list.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.Timesheets.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.Timesheets.list.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.Timesheets.list.filter.filterButton, 'Filter'),
  searchTitle: () => _t(translations.Timesheets.search.title, 'Search'),
  searchLabel: () => _t(translations.Timesheets.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.Timesheets.search.search.placeholder,
      "Search user's first name, last name, email and phone number",
    ),
  searchSearchButton: () =>
    _t(translations.Timesheets.search.searchButton, 'Search'),
  searchResetButton: () =>
    _t(translations.Timesheets.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.Timesheets.modal.createTitle, 'Create Timesheets'),
  modalEditTitle: () =>
    _t(translations.Timesheets.modal.editTitle, 'Edit Timesheets'),
  modalPreviewCSVTitle: () =>
    _t(translations.Timesheets.modal.previewCSVTitle, 'Preview Import File'),
  modalFormDeleteButton: () =>
    _t(translations.Timesheets.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.Timesheets.modal.form.deleteContent,
      'Are you sure to delete this Timesheets?',
    ),
  modalFormCancelButton: () =>
    _t(translations.Timesheets.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.Timesheets.modal.form.submitButton, 'Save'),
};
