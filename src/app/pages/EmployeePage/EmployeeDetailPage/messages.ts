/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const UserDetailMessages = {
  title: () => _t(translations.UserDetailPage.title, 'User detail'),
  description: () => _t(translations.UserDetailPage.description, 'User detail'),
  cancel: () => _t(translations.UserDetailPage.cancel, 'Cancel'),
  createTitle: () => _t(translations.UserDetailPage.createTitle, 'Create user'),
  formAvatarUpload: () =>
    _t(translations.UserDetailPage.modal.form.avatar.upload, 'Upload image'),
  formAvatarLabel: () =>
    _t(translations.UserDetailPage.modal.form.avatar.label, 'Avatar'),
  formCodeLabel: () =>
    _t(translations.UserDetailPage.modal.form.code.label, 'Employee code'),
  formCodePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.code.placeholder,
      'Enter employee code',
    ),
  formCodeEmpty: () =>
    _t(
      translations.UserDetailPage.modal.form.code.empty,
      'Please enter employee code',
    ),

  formEmptyAvatar: () =>
    _t(
      translations.UserDetailPage.modal.form.avatar.empty,
      'Please upload employee avatar',
    ),
  formProfileTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.title,
      'Profile infomation',
    ),
  formFirstNameLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.label,
      'First name',
    ),
  formFirstNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.placeholder,
      'First name',
    ),
  formEmptyFirstName: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.empty,
      'Please enter first name',
    ),
  formLastNameLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.label,
      'Last name',
    ),
  formLastNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.placeholder,
      'Last name',
    ),
  formEmptyLastName: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.empty,
      'Please enter last name',
    ),
  formDOBLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.label,
      'Date of birth',
    ),
  formDOBPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.placeholder,
      'Select DOB',
    ),
  formEmptyDOB: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.empty,
      'Please enter date of birth',
    ),
  formPositionLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.position.label,
      'Position',
    ),
  formPositionPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.position.placeholder,
      'Select position',
    ),
  formInvalidDOB: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.invalid,
      'Only allow 16+ years old!',
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
      'Please select gender',
    ),
  formPhoneNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.label,
      'Phone number',
    ),
  formSkillLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.skills.label, 'Skills'),
  formPhoneNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.placeholder,
      'Phone number',
    ),
  formEmptyPhoneNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.empty,
      'Please enter phone number',
    ),
  formInvalidPhoneNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.invalid,
      'Phone mumber is invalid',
    ),
  formEmailLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.email.label, 'Email'),
  formEmailPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.placeholder,
      'Email',
    ),
  formEmptyEmail: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.empty,
      'Please enter email',
    ),
  formInvalidEmail: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.invalid,
      'Email is invalid',
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
  formJoinedLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.joined.label, 'Joined'),
  formJoinedPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.joined.placeholder,
      'Joined date',
    ),
  formIDCardTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idCard.title,
      'ID card information',
    ),
  formIdNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idNumber.label,
      'ID number',
    ),
  formIdNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idNumber.placeholder,
      'ID number',
    ),
  formIssuedDateLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedDate.label,
      'Issued date',
    ),
  formIssuedDatePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedDate.placeholder,
      'Issued date',
    ),
  formIssuedPlaceLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedPlace.label,
      'Issued place',
    ),
  formIssuedPlacePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedPlace.placeholder,
      'Issued place',
    ),
  formInsuranceNoLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.insuranceNo.label,
      'Social insurance #',
    ),
  formInsuranceNoPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.insuranceNo.placeholder,
      'Social insurance #',
    ),
  formNicknameLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.nickname.label,
      'Nickname',
    ),
  formNicknamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.nickname.placeholder,
      'Nickname',
    ),
  formJobTitle: () =>
    _t(translations.UserDetailPage.modal.form.job.title, 'Job infomation'),
  formJobDescription: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobDesc.label,
      'Job description',
    ),
  formJobDesPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobDesc.placeholder,
      'Job description',
    ),
  formJobTitleLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.jobTitle.label, 'Job title'),
  formJobTitlePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTitle.placeholder,
      'Input job title',
    ),
  formEmptyJobTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTitle.empty,
      'Please enter job title',
    ),
  formTypeLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.type.label, 'Type'),
  formTypePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.job.type.placeholder,
      'Select type',
    ),
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
      'Employee tags',
    ),
  formBankAccountsTitle: () =>
    _t(translations.UserDetailPage.modal.form.bank.title, 'Bank account'),
  formBankNameLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.name.label, 'Bank name'),
  formBankNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.name.placeholder,
      'Select bank name',
    ),
  formEmptyBankName: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.name.empty,
      'Please enter bank name',
    ),
  formBankNumberLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.number.label, 'Bank number'),
  formBankNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.placeholder,
      'Enter account number',
    ),
  formEmptyBankNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.empty,
      'Please enter bank number',
    ),
  formBankBranchLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.branch.label, 'Bank branch'),
  formBankBranchPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.placeholder,
      'Enter account holder',
    ),
  formEmptyBankBranch: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.empty,
      'Please enter bank branch',
    ),
  formSocialNetworkTitle: () =>
    _t(translations.UserDetailPage.modal.form.social.title, 'Social accounts'),
  formSocialsSkypeLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.skype.label, 'Skype'),
  formSocialsSkypePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.skype.placeholder,
      'Input Skype ID',
    ),
  formSocialsTwitterLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.twitter.label, 'Twitter'),
  formSocialsTwitterPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.twitter.placeholder,
      'Input Twitter ID',
    ),
  formSocialsFacebookLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.social.facebook.label,
      'Facebook',
    ),
  formSocialsFacebookPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.facebook.placeholder,
      'Input Facebook ID',
    ),
  formSocialsLinkedinLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.social.linkedin.label,
      'Linkedin',
    ),
  formSocialsLinkedinPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.linkedin.placeholder,
      'Input Linkedin ID',
    ),
  formSocialsGithubLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.github.label, 'Github'),
  formSocialsGithubPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.github.placeholder,
      'Input Github ID',
    ),
  formSocialsGitlabLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.gitlab.label, 'Gitlab'),
  formSocialsGitlabPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.gitlab.placeholder,
      'Input Gitlab ID',
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
      'Update employee successful',
    ),
};
