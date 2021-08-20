/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ProjectDetailMessages = {
  title: () => _t(translations.ProjectDetailPage.title, 'Project detail'),
  description: () =>
    _t(translations.ProjectDetailPage.description, 'Project detail'),
  createTitle: () =>
    _t(translations.ProjectDetailPage.createTitle, 'Create project'),
  editTitle: () => _t(translations.ProjectDetailPage.editTitle, 'Edit project'),
  addMember: () => _t(translations.ProjectDetailPage.addMember, 'Add member'),
  cancel: () => _t(translations.ProjectDetailPage.cancel, 'Cancel'),
  editMember: () =>
    _t(translations.ProjectDetailPage.editMember, 'Edit member'),
  formProjectCodeLabel: () =>
    _t(translations.ProjectDetailPage.form.projectCode.label, 'Code'),
  formProjectCodePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectCode.placeholder,
      'Enter code',
    ),
  formProjectCodeEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectCode.empty,
      'Please enter code',
    ),
  formProjectNameLabel: () =>
    _t(translations.ProjectDetailPage.form.projectName.label, 'Name'),
  formProjectNamePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectName.placeholder,
      'Enter name',
    ),
  formProjectNameEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectName.empty,
      'Please enter name',
    ),
  formProjectStartedLabel: () =>
    _t(translations.ProjectDetailPage.form.projectStarted.label, 'Start date'),
  formProjectStartedPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectStarted.placeholder,
      'Select start date',
    ),
  formProjectStartedEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectStarted.empty,
      'Please start date',
    ),
  formProjectPriorityLabel: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.label, 'Priority'),
  formProjectPriorityPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectPriority.placeholder,
      'Select priority',
    ),
  formProjectPriorityEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectPriority.empty,
      'Please select priority',
    ),
  formProjectPriorityLow: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.low, 'Low'),
  formProjectPriorityMedium: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.medium, 'Medium'),
  formProjectPriorityHigh: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.high, 'High'),
  formProjectStatusLabel: () =>
    _t(translations.ProjectDetailPage.form.projectStatus.label, 'Status'),
  formProjectStatusPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectStatus.placeholder,
      'Select status',
    ),
  formProjectStatusEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectStatus.empty,
      'Please select status',
    ),
  formProjectStatusPreparing: () =>
    _t(
      translations.ProjectDetailPage.form.projectStatus.preparing,
      'Preparing',
    ),
  formProjectStatusGoing: () =>
    _t(translations.ProjectDetailPage.form.projectStatus.going, 'Going'),
  formProjectStatusReleased: () =>
    _t(translations.ProjectDetailPage.form.projectStatus.released, 'Released'),
  formProjectStatusArchived: () =>
    _t(translations.ProjectDetailPage.form.projectStatus.archived, 'Archived'),
  formProjectOverviewLabel: () =>
    _t(translations.ProjectDetailPage.form.projectOverview.label, 'Overview'),
  formProjectOverviewPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectOverview.placeholder,
      'Enter project overview',
    ),
  formProjectOverviewEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectOverview.empty,
      'Please enter project overview',
    ),
  memberTitle: () =>
    _t(translations.ProjectDetailPage.member.title, 'Team members'),
  memberPM: () =>
    _t(translations.ProjectDetailPage.member.pm, 'Project manager'),
  memberTL: () => _t(translations.ProjectDetailPage.member.tl, 'Team leader'),
  memberQC: () => _t(translations.ProjectDetailPage.member.qc, 'QC'),
  memberDEV: () => _t(translations.ProjectDetailPage.member.dev, 'Developer'),
  memberOTHER: () => _t(translations.ProjectDetailPage.member.other, 'Other'),
  memberFormEmployeeLabel: () =>
    _t(translations.ProjectDetailPage.member.form.employee.label, 'Employee'),
  memberFormEmployeePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.member.form.employee.placeholder,
      'Enter name, email',
    ),
  memberFormEmployeeEmpty: () =>
    _t(
      translations.ProjectDetailPage.member.form.employee.empty,
      'Please enter name, email',
    ),
  memberFormProjectRoleLabel: () =>
    _t(translations.ProjectDetailPage.member.form.projectRole.label, 'Role'),
  memberFormProjectRolePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.member.form.projectRole.placeholder,
      'Select role',
    ),
  memberFormProjectRoleEmpty: () =>
    _t(
      translations.ProjectDetailPage.member.form.projectRole.empty,
      'Please select role',
    ),
  memberFormAllocationLabel: () =>
    _t(
      translations.ProjectDetailPage.member.form.allocation.label,
      'Allocation',
    ),
  memberFormAllocationPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.member.form.allocation.placeholder,
      'Select allocation',
    ),
  memberFormAllocationEmpty: () =>
    _t(
      translations.ProjectDetailPage.member.form.allocation.empty,
      'Please select allocation',
    ),
  messageCreateProjectSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.createProjectSuccess,
      'Create project successful',
    ),
  messageEditProjectSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.editProjectSuccess,
      'Update project successful',
    ),
  messageCreateMemberSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.createMemberSuccess,
      'Create member successful',
    ),
  messageEditMemberSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.editMemberSuccess,
      'Update member successful',
    ),
  buttonCreate: () =>
    _t(translations.ProjectDetailPage.button.create, 'Create'),
  buttonEdit: () => _t(translations.ProjectDetailPage.button.edit, 'Edit'),
  buttonDelete: () =>
    _t(translations.ProjectDetailPage.button.delete, 'Delete'),
  buttonCancel: () =>
    _t(translations.ProjectDetailPage.button.cancel, 'Cancel'),
  buttonBack: () => _t(translations.ProjectDetailPage.button.back, 'Back'),
  buttonSubmit: () =>
    _t(translations.ProjectDetailPage.button.submit, 'Submit'),
};
