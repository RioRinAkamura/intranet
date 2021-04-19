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
  modalInfomationTitle: () =>
    _t(translations.UsersPage.modal.infomation, 'Profile Infomation'),
  modalFormAvatarUpload: () =>
    _t(translations.UsersPage.modal.form.avatar.upload, 'Upload'),
  modalFormAvatarLabel: () =>
    _t(translations.UsersPage.modal.form.avatar.label, 'Avatar'),
  modalFormEmptyAvatar: () =>
    _t(
      translations.UsersPage.modal.form.avatar.empty,
      'Please upload user avatar!',
    ),
  modalFormFirstNameLabel: () =>
    _t(translations.UsersPage.modal.form.firstName.label, 'First Name'),
  modalFormFirstNamePlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.firstName.placeholder,
      'User first name',
    ),
  modalFormEmptyFirstName: () =>
    _t(
      translations.UsersPage.modal.form.firstName.empty,
      'Please input user first name!',
    ),
  modalFormLastNameLabel: () =>
    _t(translations.UsersPage.modal.form.lastName.label, 'Last Name'),
  modalFormLastNamePlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.lastName.placeholder,
      'User last name',
    ),
  modalFormEmptyLastName: () =>
    _t(
      translations.UsersPage.modal.form.lastName.empty,
      'Please input user last name!',
    ),
  modalFormEmailLabel: () =>
    _t(translations.UsersPage.modal.form.email.label, 'Email'),
  modalFormEmailPlaceholder: () =>
    _t(translations.UsersPage.modal.form.email.placeholder, 'User email'),
  modalFormEmptyEmail: () =>
    _t(
      translations.UsersPage.modal.form.email.empty,
      'Please input user email!',
    ),
  modalFormInvalidEmail: () =>
    _t(
      translations.UsersPage.modal.form.email.invalid,
      "User's email is invalid!",
    ),
  modalFormDOBLabel: () =>
    _t(translations.UsersPage.modal.form.DOB.label, 'Date of Birth'),
  modalFormDOBPlaceholder: () =>
    _t(translations.UsersPage.modal.form.DOB.placeholder, "Select user's DOB"),
  modalFormEmptyDOB: () =>
    _t(
      translations.UsersPage.modal.form.DOB.empty,
      "Please input user's date of birth!",
    ),
  modalFormGenderLabel: () =>
    _t(translations.UsersPage.modal.form.gender.label, 'Gender'),
  modalFormGenderMaleLabel: () =>
    _t(translations.UsersPage.modal.form.gender.male.label, 'Male'),
  modalFormGenderFemaleLabel: () =>
    _t(translations.UsersPage.modal.form.gender.female.label, 'Female'),
  modalFormPhoneNumberLabel: () =>
    _t(translations.UsersPage.modal.form.phoneNumber.label, 'Phone Number'),
  modalFormPhoneNumberPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.phoneNumber.placeholder,
      'User phone number',
    ),
  modalFormEmptyPhoneNumber: () =>
    _t(
      translations.UsersPage.modal.form.phoneNumber.empty,
      'Please input user phone number!',
    ),
  modalFormInvalidPhoneNumber: () =>
    _t(
      translations.UsersPage.modal.form.phoneNumber.invalid,
      "User's phone number is invalid!",
    ),
  modalFormStatusLabel: () =>
    _t(translations.UsersPage.modal.form.status.label, 'Status'),
  modalFormStatusSingleLabel: () =>
    _t(translations.UsersPage.modal.form.status.single.label, 'Single'),
  modalFormStatusMarriedLabel: () =>
    _t(translations.UsersPage.modal.form.status.married.label, 'Married'),
  modalFormTypeLabel: () =>
    _t(translations.UsersPage.modal.form.type.label, 'Type'),
  modalFormTypeFullTimeLabel: () =>
    _t(translations.UsersPage.modal.form.type.fullTime.label, 'Full-time'),
  modalFormTypePartTimeLabel: () =>
    _t(translations.UsersPage.modal.form.type.partTim.label, 'Part-time'),
  modalFormTypeProbationLabel: () =>
    _t(translations.UsersPage.modal.form.type.probation.label, 'Probation'),
  modalFormTypeEtcLabel: () =>
    _t(translations.UsersPage.modal.form.type.etc.label, 'Etc'),
  modalFormJobLabel: () =>
    _t(translations.UsersPage.modal.form.job.label, 'Job Infomation'),
  modalFormJobTitleLabel: () =>
    _t(translations.UsersPage.modal.form.jobTitle.label, 'Job Title'),
  modalFormJobTitlePlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.jobTitle.placeholder,
      "Input user's job title!",
    ),
  modalFormEmptyJobTitle: () =>
    _t(
      translations.UsersPage.modal.form.jobTitle.empty,
      "Please input user's job title!",
    ),
  modalFormSocialsLabel: () =>
    _t(translations.UsersPage.modal.form.socials.label, 'Social Network'),
  modalFormSocialsSkypeLabel: () =>
    _t(translations.UsersPage.modal.form.socials.skype.label, 'Skype'),
  modalFormSocialsSkypePlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.socials.skype.placeholder,
      "Input user's Skype",
    ),
  modalFormSocialsTwitterLabel: () =>
    _t(translations.UsersPage.modal.form.socials.twitter.label, 'Twitter'),
  modalFormSocialsTwitterPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.socials.twitter.placeholder,
      "Input user's Twitter",
    ),
  modalFormSocialsFacebookLabel: () =>
    _t(translations.UsersPage.modal.form.socials.facebook.label, 'Facebook'),
  modalFormSocialsFacebookPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.socials.facebook.placeholder,
      "Input user's Facebook",
    ),
  modalFormSocialsLinkedinLabel: () =>
    _t(translations.UsersPage.modal.form.socials.linkedin.label, 'Linkedin'),
  modalFormSocialsLinkedinPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.socials.linkedin.placeholder,
      "Input user's Linkedin",
    ),
  modalFormSocialsGithubLabel: () =>
    _t(translations.UsersPage.modal.form.socials.github.label, 'Github'),
  modalFormSocialsGithubPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.socials.github.placeholder,
      "Input user's Github",
    ),
  modalFormSocialsGitlabLabel: () =>
    _t(translations.UsersPage.modal.form.socials.gitlab.label, 'Gitlab'),
  modalFormSocialsGitlabPlaceholder: () =>
    _t(
      translations.UsersPage.modal.form.socials.gitlab.placeholder,
      "Input user's Gitlab",
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
