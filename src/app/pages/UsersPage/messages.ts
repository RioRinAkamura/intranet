/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const UsersMessages = {
  title: () => _t(translations.UsersPage.title, 'Login'),
  description: () => _t(translations.UsersPage.description, 'Login Page'),
  createUserButton: () =>
    _t(translations.UsersPage.createUserButton, 'Create User'),
  exportCSV: () => _t(translations.UsersPage.exportCSV, 'Export as CSV'),
  importCSV: () => _t(translations.UsersPage.importCSV, 'Import CSV'),
  listAvatarTitle: () => _t(translations.UsersPage.list.avatar, 'Avatar'),
  listFirstNameTitle: () =>
    _t(translations.UsersPage.list.firstName, 'First Name'),
  listLastNameTitle: () =>
    _t(translations.UsersPage.list.lastName, 'Last Name'),
  listEmailTitle: () => _t(translations.UsersPage.list.email, 'Email'),
  listOptionsTitle: () => _t(translations.UsersPage.list.options, 'Options'),
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
  searchFirstName: () =>
    _t(translations.UsersPage.search.firstName, 'First Name'),
  searchFirstNamePlaceholder: () =>
    _t(
      translations.UsersPage.search.firstNamePlaceholder,
      'Search by first name',
    ),
  searchLastName: () => _t(translations.UsersPage.search.lastName, 'Last Name'),
  searchLastNamePlaceholder: () =>
    _t(
      translations.UsersPage.search.lastNamePlaceholder,
      'Search by last name',
    ),
  searchEmail: () => _t(translations.UsersPage.search.email, 'Email'),
  searchEmailPlaceholder: () =>
    _t(translations.UsersPage.search.emailPlaceholder, 'Search by email'),
  searchPhoneNumber: () =>
    _t(translations.UsersPage.search.phoneNumber, 'Phone Number'),
  searchPhoneNumberPlaceholder: () =>
    _t(
      translations.UsersPage.search.phoneNumberPlaceholder,
      'Search by phone number',
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
  modalFormAvatarUpload: () =>
    _t(translations.UsersPage.modal.form.avatarUpload, 'Upload'),
  modalFormAvatarLabel: () =>
    _t(translations.UsersPage.modal.form.avatarLabel, 'Avatar'),
  modalFormEmptyAvatar: () =>
    _t(
      translations.UsersPage.modal.form.emptyAvatar,
      'Please upload user avatar!',
    ),
  modalFormFirstNameLabel: () =>
    _t(translations.UsersPage.modal.form.firstNameLabel, 'First Name'),
  modalFormFirstNamePlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.firstNamePlaceholder,
      'User first name',
    ),
  modalFormEmptyFirstName: () =>
    _t(
      translations.UsersPage.modal.form.emptyFirstName,
      'Please input user first name!',
    ),
  modalFormLastNameLabel: () =>
    _t(translations.UsersPage.modal.form.lastNameLabel, 'Last Name'),
  modalFormLastNamePlaceholder: () =>
    _t(translations.UsersPage.modal.form.lastNamePlaceholder, 'User last name'),
  modalFormEmptyLastName: () =>
    _t(
      translations.UsersPage.modal.form.emptyLastName,
      'Please input user last name!',
    ),
  modalFormEmailLabel: () =>
    _t(translations.UsersPage.modal.form.emailLabel, 'Email'),
  modalFormEmailPlaceholder: () =>
    _t(translations.UsersPage.modal.form.emailPlaceholder, 'User email'),
  modalFormEmptyEmail: () =>
    _t(
      translations.UsersPage.modal.form.emptyEmail,
      'Please input user email!',
    ),
  modalFormInvalidEmail: () =>
    _t(
      translations.UsersPage.modal.form.invalidEmail,
      "User's email is invalid!",
    ),
  modalFormPhoneNumberLabel: () =>
    _t(translations.UsersPage.modal.form.phoneNumberLabel, 'Phone Number'),
  modalFormPhoneNumberPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.phoneNumberPlaceholder,
      'User phone number',
    ),
  modalFormEmptyPhoneNumber: () =>
    _t(
      translations.UsersPage.modal.form.emptyPhoneNumber,
      'Please input user phone number!',
    ),
  modalFormInvalidPhoneNumber: () =>
    _t(
      translations.UsersPage.modal.form.emptyPhoneNumber,
      "User's phone number is invalid!",
    ),
  modalFormSubmitButton: () =>
    _t(translations.UsersPage.modal.form.submitButton, 'Save'),
  modalFormDeleteButton: () =>
    _t(translations.UsersPage.modal.form.deleteButton, 'Delete'),
  modalFormDeleteContent: () =>
    _t(
      translations.UsersPage.modal.form.deleteContent,
      'Are you sure to delete this user?',
    ),
  modalFormCancelButton: () =>
    _t(translations.UsersPage.modal.form.cancelButton, 'Cancel'),
};
