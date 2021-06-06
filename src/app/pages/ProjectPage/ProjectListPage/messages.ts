/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ProjectsMessages = {
  title: () => _t(translations.ProjectsPage.title, 'Projects'),
  description: () => _t(translations.ProjectsPage.description, 'Projects'),
  createProjectButton: () =>
    _t(translations.ProjectsPage.createProjectButton, 'Create Project'),
  exportCSV: () => _t(translations.ProjectsPage.exportCSV, 'Export as CSV'),
  exportAllProject: () =>
    _t(translations.ProjectsPage.exportAllProject, 'Export as CSV for all'),
  exportCSVMessage: () =>
    _t(
      translations.UsersPage.exportCSVMessage,
      'Click link below to download the export file',
    ),
  exportPerPage: () =>
    _t(translations.ProjectsPage.exportPerPage, 'Export as CSV this page'),
  exportSelected: () =>
    _t(
      translations.ProjectsPage.exportSelected,
      'Export as CSV for selected rows',
    ),
  importCSV: () => _t(translations.ProjectsPage.importCSV, 'Import CSV'),
  listAvatarTitle: () => _t(translations.ProjectsPage.list.avatar, 'Avatar'),
  listNameTitle: () => _t(translations.ProjectsPage.list.name, 'Name'),
  listTMTitle: () => _t(translations.ProjectsPage.list.tm, 'Team Members'),
  listPMTitle: () => _t(translations.ProjectsPage.list.pm, 'Project Manager'),
  listLDTitle: () => _t(translations.ProjectsPage.list.ld, 'Leader'),
  listQCTitle: () =>
    _t(translations.ProjectsPage.list.qc, 'Quality Controller'),
  listDEVTitle: () => _t(translations.ProjectsPage.list.dev, 'Developer'),
  listOTHERTitle: () => _t(translations.ProjectsPage.list.other, 'Other'),
  listStartedTitle: () => _t(translations.ProjectsPage.list.started, 'Started'),
  listPriorityTitle: () =>
    _t(translations.ProjectsPage.list.priority, 'Priority'),
  listStatusTitle: () => _t(translations.ProjectsPage.list.status, 'Status'),
  listTotalMembers: () => _t(translations.ProjectsPage.list.totalMembers),
  listTotalWeeklyHours: () =>
    _t(translations.ProjectsPage.list.totalWeeklyHours),
  listOptionsTitle: () => _t(translations.ProjectsPage.list.options, 'Actions'),
  listViewTooltip: () => _t(translations.ProjectsPage.list.viewTooltip, 'View'),
  listEditTooltip: () => _t(translations.ProjectsPage.list.EditTooltip, 'Edit'),
  listDeleteTooltip: () =>
    _t(translations.ProjectsPage.list.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.ProjectsPage.list.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.ProjectsPage.list.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.ProjectsPage.list.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.ProjectsPage.list.filter.filterButton, 'Filter'),
  searchTitle: () => _t(translations.ProjectsPage.search.title, 'Search'),
  searchLabel: () =>
    _t(translations.ProjectsPage.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.ProjectsPage.search.search.placeholder,
      "Search project's name, priority and status",
    ),
  searchSearchButton: () =>
    _t(translations.ProjectsPage.search.searchButton, 'Search'),
  searchResetButton: () =>
    _t(translations.ProjectsPage.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.ProjectsPage.modal.createTitle, 'Create Project'),
  modalEditTitle: () =>
    _t(translations.ProjectsPage.modal.editTitle, 'Edit Project'),
  modalProfileTitle: () =>
    _t(translations.ProjectsPage.modal.profileTitle, 'Project Profile'),
  modalPreviewCSVTitle: () =>
    _t(translations.ProjectsPage.modal.previewCSVTitle, 'Preview Import File'),
  modalFormDeleteButton: () =>
    _t(translations.ProjectsPage.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.ProjectsPage.modal.form.deleteContent,
      'Are you sure to delete this project?',
    ),
  modalFormCancelButton: () =>
    _t(translations.ProjectsPage.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.ProjectsPage.modal.form.submitButton, 'Save'),
};
