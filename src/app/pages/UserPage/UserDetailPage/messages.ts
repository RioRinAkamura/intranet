/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const UserDetailMessages = {
  title: () => _t(translations.UserDetailPage.title, 'User Detail'),
  description: () => _t(translations.UserDetailPage.description, 'User Detail'),
  createTitle: () => _t(translations.UserDetailPage.createTitle, 'Create User'),
  formAvatarUpload: () =>
    _t(translations.UserDetailPage.modal.form.avatar.upload, 'Upload'),
  formAvatarLabel: () =>
    _t(translations.UserDetailPage.modal.form.avatar.label, 'Avatar'),
  formCodeLabel: () =>
    _t(translations.UserDetailPage.modal.form.code.label, 'Code'),
  formCodePlaceholder: () =>
    _t(translations.UserDetailPage.modal.form.code.placeholder, "User's code"),
  formEmptyAvatar: () =>
    _t(
      translations.UserDetailPage.modal.form.avatar.empty,
      "Please upload user's avatar!",
    ),
  formProfileTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.title,
      'Profile Infomation',
    ),
  formFirstNameLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.label,
      'First Name',
    ),
  formFirstNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.placeholder,
      "User's first name",
    ),
  formEmptyFirstName: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.empty,
      'Please input user first name!',
    ),
  formLastNameLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.label,
      'Last Name',
    ),
  formLastNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.placeholder,
      "User's last name",
    ),
  formEmptyLastName: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.empty,
      'Please input user last name!',
    ),
  formDOBLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.label,
      'Date of Birth',
    ),
  formDOBPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.placeholder,
      "Select user's DOB",
    ),
  formEmptyDOB: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.empty,
      "Please input user's date of birth!",
    ),
  formGenderLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.gender.label, 'Gender'),
  formGenderMaleLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.gender.male.label,
      'Male',
    ),
  formGenderFemaleLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.gender.female.label,
      'Female',
    ),
  formGenderOtherLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.gender.other.label,
      'Other',
    ),
  formEmptyGender: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.gender.empty,
      "Please select user's gender",
    ),
  formPhoneNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.label,
      'Phone Number',
    ),
  formPhoneNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.placeholder,
      "User's phone number",
    ),
  formEmptyPhoneNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.empty,
      "Please input user's phone number!",
    ),
  formInvalidPhoneNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.invalid,
      "User's phone number is invalid!",
    ),
  formEmailLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.email.label, 'Email'),
  formEmailPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.placeholder,
      "User's email",
    ),
  formEmptyEmail: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.empty,
      "Please input user's email!",
    ),
  formInvalidEmail: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.invalid,
      "User's email is invalid!",
    ),
  formStatusLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.status.label, 'Status'),
  formStatusSingleLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.status.single.label,
      'Single',
    ),
  formStatusMarriedLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.status.married.label,
      'Married',
    ),
  formIdNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idNumber.label,
      'Id Number',
    ),
  formIdNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idNumber.placeholder,
      "User's id number",
    ),
  formIssuedDateLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedDate.label,
      'Issued Date',
    ),
  formIssuedDatePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedDate.placeholder,
      "User's issued date",
    ),
  formIssuedPlaceLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedPlace.label,
      'Issued Place',
    ),
  formIssuedPlacePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedPlace.placeholder,
      "User's issued place",
    ),
  formSocialInsuranceNoLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.socialInsuranceNo.label,
      'Social Insurance No',
    ),
  formSocialInsuranceNoPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.socialInsuranceNo
        .placeholder,
      "User's social insurance no",
    ),
  formJobTitle: () =>
    _t(translations.UserDetailPage.modal.form.job.title, 'Job Infomation'),
  formJobTitleLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.jobTitle.label, 'Job Title'),
  formJobTitlePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTitle.placeholder,
      "Input user's job title!",
    ),
  formEmptyJobTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTitle.empty,
      "Please input user's job title!",
    ),
  formTypeLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.type.label, 'Type'),
  formTypeFullTimeLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.job.type.fullTime.label,
      'Full-time',
    ),
  formTypePartTimeLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.job.type.partTim.label,
      'Part-time',
    ),
  formTypeProbationLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.job.type.probation.label,
      'Probation',
    ),
  formTypeEtcLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.type.etc.label, 'Etc'),
  formJobTagsLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.jobTags.label, 'Tags'),
  formJobTagsPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTags.placeholder,
      "User's tags",
    ),
  formBankAccountsTitle: () =>
    _t(translations.UserDetailPage.modal.form.bank.title, 'Bank Accounts'),
  formBankNameLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.name.label, 'Bank Name'),
  formBankNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.name.placeholder,
      "User's bank name",
    ),
  formEmptyBankName: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.name.empty,
      "Please input user's bank name",
    ),
  formBankNumberLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.number.label, 'Bank Number'),
  formBankNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.placeholder,
      "User's bank number",
    ),
  formEmptyBankNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.empty,
      "Please input user's bank number",
    ),
  formBankBranchLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.branch.label, 'Branch'),
  formBankBranchPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.placeholder,
      "User's bank branch",
    ),
  formEmptyBankBranch: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.empty,
      "Please input user's bank branch",
    ),
  formBankAddButton: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.button.add,
      'Add Bank Account',
    ),
  formSocialNetworkTitle: () =>
    _t(translations.UserDetailPage.modal.form.social.title, 'Social Network'),
  formSocialsSkypeLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.skype.label, 'Skype'),
  formSocialsSkypePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.skype.placeholder,
      "Input user's Skype",
    ),
  formSocialsTwitterLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.twitter.label, 'Twitter'),
  formSocialsTwitterPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.twitter.placeholder,
      "Input user's Twitter",
    ),
  formSocialsFacebookLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.social.facebook.label,
      'Facebook',
    ),
  formSocialsFacebookPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.facebook.placeholder,
      "Input user's Facebook",
    ),
  formSocialsLinkedinLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.social.linkedin.label,
      'Linkedin',
    ),
  formSocialsLinkedinPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.linkedin.placeholder,
      "Input user's Linkedin",
    ),
  formSocialsGithubLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.github.label, 'Github'),
  formSocialsGithubPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.github.placeholder,
      "Input user's Github",
    ),
  formSocialsGitlabLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.gitlab.label, 'Gitlab'),
  formSocialsGitlabPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.gitlab.placeholder,
      "Input user's Gitlab",
    ),
  formEditButton: () =>
    _t(translations.UserDetailPage.modal.form.button.edit, 'Edit'),
  formSubmitButton: () =>
    _t(translations.UserDetailPage.modal.form.button.submit, 'Save'),
  formCancelButton: () =>
    _t(translations.UserDetailPage.modal.form.button.cancel, 'Cancel'),
  formBackButton: () =>
    _t(translations.UserDetailPage.modal.form.button.back, 'Back'),
  updateSuccessMessage: () =>
    _t(
      translations.UserDetailPage.modal.message.sucess,
      'Update employee successfully',
    ),
};
