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
    _t(translations.ProjectsPage.createProjectButton, 'Create project'),
  listAvatarTitle: () => _t(translations.ProjectsPage.list.avatar, 'Avatar'),
  listNameTitle: () => _t(translations.ProjectsPage.list.name, 'Name'),
  listTMTitle: () => _t(translations.ProjectsPage.list.tm, 'Team members'),
  listPMTitle: () => _t(translations.ProjectsPage.list.pm, 'Project manager'),
  listLDTitle: () => _t(translations.ProjectsPage.list.ld, 'Leader'),
  listQCTitle: () => _t(translations.ProjectsPage.list.qc, 'QC'),
  listDEVTitle: () => _t(translations.ProjectsPage.list.dev, 'Developer'),
  listOTHERTitle: () => _t(translations.ProjectsPage.list.other, 'Other'),
  listStartedTitle: () => _t(translations.ProjectsPage.list.started, 'Started'),
  listPriorityTitle: () =>
    _t(translations.ProjectsPage.list.priority, 'Priority'),
  listStatusTitle: () => _t(translations.ProjectsPage.list.status, 'Status'),
  listTotalMembers: () =>
    _t(translations.ProjectsPage.list.totalMembers, 'Members'),
  listCode: () => _t(translations.ProjectsPage.list.code, 'Code'),
  listTotalWeeklyHours: () =>
    _t(translations.ProjectsPage.list.totalWeeklyHours, 'Total weekly hours'),
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
    _t(translations.ProjectsPage.modal.createTitle, 'Create project'),
  modalEditTitle: () =>
    _t(translations.ProjectsPage.modal.editTitle, 'Edit project'),
  modalProfileTitle: () =>
    _t(translations.ProjectsPage.modal.profileTitle, 'Project details'),
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
