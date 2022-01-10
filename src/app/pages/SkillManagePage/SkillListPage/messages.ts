/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const SkillMessages = {
  title: () => _t(translations.SkillManagePage.skill.title, 'Skills'),
  description: () =>
    _t(translations.SkillManagePage.skill.description, 'Skills'),
  listOptionsTitle: () =>
    _t(translations.SkillManagePage.skill.options, 'Actions'),
  listViewTooltip: () =>
    _t(translations.SkillManagePage.skill.viewTooltip, 'View'),
  listEditTooltip: () =>
    _t(translations.SkillManagePage.skill.EditTooltip, 'Edit'),
  listDeleteTooltip: () =>
    _t(translations.SkillManagePage.skill.DeleteTooltip, 'Delete'),
  filterInputPlaceholder: () =>
    _t(translations.SkillManagePage.skill.filter.inputPlaceholder, 'Search'),
  filterSearchButton: () =>
    _t(translations.SkillManagePage.skill.filter.searchButton, 'Search'),
  filterResetButton: () =>
    _t(translations.SkillManagePage.skill.filter.resetButton, 'Reset'),
  filterFilterButton: () =>
    _t(translations.SkillManagePage.skill.filter.filterButton, 'Filter'),
  searchTitle: () =>
    _t(translations.SkillManagePage.skill.search.title, 'Search'),
  searchLabel: () =>
    _t(translations.SkillManagePage.skill.search.search.label, 'Search'),
  searchPlaceholder: () =>
    _t(
      translations.SkillManagePage.skill.search.search.placeholder,
      "Search skills' name and categories' name",
    ),
  searchSearchButton: () =>
    _t(translations.SkillManagePage.skill.search.searchButton, 'Search'),
  searchResetButton: () =>
    _t(translations.SkillManagePage.skill.search.resetButton, 'Reset'),
  modalCreateTitle: () =>
    _t(translations.SkillManagePage.skill.modal.createTitle, 'Create skill'),
  modalEditTitle: () =>
    _t(translations.SkillManagePage.skill.modal.editTitle, 'Edit skill'),
  modalFormDeleteButton: () =>
    _t(translations.SkillManagePage.skill.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.SkillManagePage.skill.modal.form.deleteContent,
      'Are you sure to delete this skill?',
    ),
  modalFormCancelButton: () =>
    _t(translations.SkillManagePage.skill.modal.form.cancelButton, 'Cancel'),
  modalFormSubmitButton: () =>
    _t(translations.SkillManagePage.skill.modal.form.submitButton, 'Save'),
};
