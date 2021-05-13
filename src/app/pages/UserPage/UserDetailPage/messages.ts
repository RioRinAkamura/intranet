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
    _t(translations.UserDetailPage.modal.form.avatar.upload, 'Upload Image'),
  formAvatarLabel: () =>
    _t(translations.UserDetailPage.modal.form.avatar.label, 'Avatar'),
  formCodeLabel: () =>
    _t(translations.UserDetailPage.modal.form.code.label, 'Employee Code'),
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
      'Please upload Employee avatar!',
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
      'Enter Employee First Name',
    ),
  formEmptyFirstName: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.firstName.empty,
      'Please Enter Employee First Name!',
    ),
  formLastNameLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.label,
      'Last Name',
    ),
  formLastNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.placeholder,
      'Employee Last Name',
    ),
  formEmptyLastName: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.lastName.empty,
      'Please Enter Employee Last Name!',
    ),
  formDOBLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.label,
      'Date of Birth',
    ),
  formDOBPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.placeholder,
      'Select Employee DOB',
    ),
  formEmptyDOB: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.DOB.empty,
      'Please Enter Employee Date of Birth!',
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
      'Please Select Employee Gender',
    ),
  formPhoneNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.label,
      'Phone Number',
    ),
  formPhoneNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.placeholder,
      'Employee Phone Number',
    ),
  formEmptyPhoneNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.empty,
      'Please Enter Employee Phone Number!',
    ),
  formInvalidPhoneNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.phoneNumber.invalid,
      'Employee Phone Number Is Invalid!',
    ),
  formEmailLabel: () =>
    _t(translations.UserDetailPage.modal.form.profile.email.label, 'Email'),
  formEmailPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.placeholder,
      'Employee Email',
    ),
  formEmptyEmail: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.empty,
      'Please Enter Employee Email!',
    ),
  formInvalidEmail: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.email.invalid,
      'Employee Email Is Invalid!',
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
  formIDCardTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idCard.title,
      'Id Card Information',
    ),
  formIdNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idNumber.label,
      'Id Number',
    ),
  formIdNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.idNumber.placeholder,
      'Employee Id Number',
    ),
  formIssuedDateLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedDate.label,
      'Issued Date',
    ),
  formIssuedDatePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedDate.placeholder,
      'Employee Issued Date',
    ),
  formIssuedPlaceLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedPlace.label,
      'Issued Place',
    ),
  formIssuedPlacePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.profile.issuedPlace.placeholder,
      'Employee Issued Place',
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
      'Employee Social Insurance No',
    ),
  formJobTitle: () =>
    _t(translations.UserDetailPage.modal.form.job.title, 'Job Infomation'),
  formJobTitleLabel: () =>
    _t(translations.UserDetailPage.modal.form.job.jobTitle.label, 'Job Title'),
  formJobTitlePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTitle.placeholder,
      'Input Employee Job Title!',
    ),
  formEmptyJobTitle: () =>
    _t(
      translations.UserDetailPage.modal.form.job.jobTitle.empty,
      'Please Enter Employee Job Title!',
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
      'Employee Tags',
    ),
  formBankAccountsTitle: () =>
    _t(translations.UserDetailPage.modal.form.bank.title, 'Bank Informations'),
  formBankNameLabel: () =>
    _t(translations.UserDetailPage.modal.form.bank.name.label, 'Bank Name'),
  formBankNamePlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.name.placeholder,
      'Select Bank Name',
    ),
  formEmptyBankName: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.name.empty,
      'Please Enter Employee Bank Name',
    ),
  formBankNumberLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.label,
      'Account Number/ Card Number',
    ),
  formBankNumberPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.placeholder,
      'Enter Account Number/ Card Number',
    ),
  formEmptyBankNumber: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.number.empty,
      'Please Enter Employee bank number',
    ),
  formBankBranchLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.label,
      'Account Owner',
    ),
  formBankBranchPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.placeholder,
      "Enter Account Owner's Name",
    ),
  formEmptyBankBranch: () =>
    _t(
      translations.UserDetailPage.modal.form.bank.branch.empty,
      'Please Enter Employee Bank Branch',
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
      'Input Employee Skype',
    ),
  formSocialsTwitterLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.twitter.label, 'Twitter'),
  formSocialsTwitterPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.twitter.placeholder,
      'Input Employee Twitter',
    ),
  formSocialsFacebookLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.social.facebook.label,
      'Facebook',
    ),
  formSocialsFacebookPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.facebook.placeholder,
      'Input Employee Facebook',
    ),
  formSocialsLinkedinLabel: () =>
    _t(
      translations.UserDetailPage.modal.form.social.linkedin.label,
      'Linkedin',
    ),
  formSocialsLinkedinPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.linkedin.placeholder,
      'Input Employee Linkedin',
    ),
  formSocialsGithubLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.github.label, 'Github'),
  formSocialsGithubPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.github.placeholder,
      'Input Employee Github',
    ),
  formSocialsGitlabLabel: () =>
    _t(translations.UserDetailPage.modal.form.social.gitlab.label, 'Gitlab'),
  formSocialsGitlabPlaceholder: () =>
    _t(
      translations.UserDetailPage.modal.form.social.gitlab.placeholder,
      'Input Employee Gitlab',
    ),
  formEditButton: () =>
    _t(translations.UserDetailPage.modal.form.button.edit, 'Edit'),
  formSubmitButton: () =>
    _t(translations.UserDetailPage.modal.form.button.submit, 'Save'),
  formCancelButton: () =>
    _t(translations.UserDetailPage.modal.form.button.cancel, 'Cancel'),
  formBackButton: () =>
    _t(translations.UserDetailPage.modal.form.button.back, 'Back'),
  formAddBankButton: () =>
    _t(
      translations.UserDetailPage.modal.form.button.addBank,
      'Add Bank Account',
    ),
  formEditBankButton: () =>
    _t(
      translations.UserDetailPage.modal.form.button.editBank,
      'Edit Bank Account',
    ),
  formSubmitAddBankButton: () =>
    _t(translations.UserDetailPage.modal.form.button.submitAddBank, 'Submit'),
  updateSuccessMessage: () =>
    _t(
      translations.UserDetailPage.modal.message.sucess,
      'Update employee successfully',
    ),
};
