/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const Messages = {
  title: () => _t(translations.Device.title, 'Device'),
  description: () => _t(translations.Device.description, 'Device'),
  createUserButton: () =>
    _t(translations.Device.createUserButton, 'Create Device'),
  exportCSV: () => _t(translations.Device.exportCSV, 'Export as CSV'),
  exportAllUser: () =>
    _t(translations.Device.exportAll, 'Export as CSV for all'),
  exportCSVMessage: () =>
    _t(
      translations.Device.exportCSVMessage,
      'Click link below to download the export file',
    ),
  exportPerPage: () =>
    _t(translations.Device.exportPerPage, 'Export as CSV this page'),
  exportSelected: () =>
    _t(translations.Device.exportSelected, 'Export as CSV for selected rows'),
  importCSV: () => _t(translations.Device.importCSV, 'Import CSV'),
  listEmailTitle: () => _t(translations.Device.list.email, 'Email'),
  listOptionsTitle: () => _t(translations.Device.list.options, 'Actions'),
  listViewTooltip: () => _t(translations.Device.list.viewTooltip, 'View'),
  listEditTooltip: () => _t(translations.Device.list.EditTooltip, 'Edit'),
  listDeleteTooltip: () => _t(translations.Device.list.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.Device.list.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.Device.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.Device.list.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.Device.list.filter.filterButton, 'Filter'),
  searchTitle: () => _t(translations.Device.search.title, 'Search'),
  searchLabel: () => _t(translations.Device.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.Device.search.search.placeholder,
      "Search user's first name, last name, email and phone number",
    ),
  searchSearchButton: () =>
    _t(translations.Device.search.searchButton, 'Search'),
  searchResetButton: () => _t(translations.Device.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.Device.modal.createTitle, 'Create device'),
  modalEditTitle: () => _t(translations.Device.modal.editTitle, 'Edit device'),
  modalPreviewCSVTitle: () =>
    _t(translations.Device.modal.previewCSVTitle, 'Preview import file'),
  modalFormDeleteButton: () =>
    _t(translations.Device.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.Device.modal.form.deleteContent,
      'Are you sure to delete this Device?',
    ),
  modalFormCancelButton: () =>
    _t(translations.Device.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.Device.modal.form.submitButton, 'Save'),
};
