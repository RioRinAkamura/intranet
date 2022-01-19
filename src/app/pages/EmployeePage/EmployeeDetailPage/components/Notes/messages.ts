/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const EmployeeNoteMessages = {
  //Header
  createNoteBtn: () => _t(translations.NotesPage.createNoteBtn, 'Create'),
  //List
  listScore: () => _t(translations.NotesPage.list.score, 'Score'),
  listType: () => _t(translations.NotesPage.list.type, 'Type'),
  listSummary: () => _t(translations.NotesPage.list.summary, 'Summary'),
  listDate: () => _t(translations.NotesPage.list.date, 'Date'),
  listContent: () => _t(translations.NotesPage.list.content, 'Content'),
  listActions: () => _t(translations.NotesPage.list.actions, 'Actions'),
  listViewTooltip: () => _t(translations.NotesPage.list.viewTooltip, 'View'),
  listEditTooltip: () => _t(translations.NotesPage.list.editTooltip, 'Edit'),
  listDeleteTooltip: () =>
    _t(translations.NotesPage.list.deleteTooltip, 'Delete'),
  //Modal
  modalViewTitle: () =>
    _t(translations.NotesPage.modal.viewTitle, 'Note details'),
  modalCreateTitle: () =>
    _t(translations.NotesPage.modal.createTitle, 'Create note'),
  modalEditTitle: () => _t(translations.NotesPage.modal.editTitle, 'Edit note'),
  modalCategoryLabel: () =>
    _t(translations.NotesPage.modal.form.category.label, 'Category'),
  modalCategoryPlaceholder: () =>
    _t(
      translations.NotesPage.modal.form.category.placeholder,
      'Enter category',
    ),
  modalCategorySelectPlaceholder: () =>
    _t(
      translations.NotesPage.modal.form.category.selectPlaceholder,
      'Select category',
    ),
  modalSummaryLabel: () =>
    _t(translations.NotesPage.modal.form.summary.label, 'Summary'),
  modalSummaryPlaceholder: () =>
    _t(translations.NotesPage.modal.form.summary.placeholder, 'Enter summary'),
  modalDateLabel: () =>
    _t(translations.NotesPage.modal.form.date.label, 'Date'),
  modalContentLabel: () =>
    _t(translations.NotesPage.modal.form.content.label, 'Content'),
  modalEditButton: () =>
    _t(translations.NotesPage.modal.form.editButton, 'Edit'),
  modalCancelButton: () =>
    _t(translations.NotesPage.modal.form.cancelButton, 'Cancel'),
  modalSubmitButton: () =>
    _t(translations.NotesPage.modal.form.submitButton, 'Save'),
  //Filter
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
};
