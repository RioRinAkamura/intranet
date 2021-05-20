/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const ProjectDetailMessages = {
  title: () => _t(translations.ProjectDetailPage.title, 'Project Detail'),
  description: () =>
    _t(translations.ProjectDetailPage.description, 'Project Detail'),
  createTitle: () =>
    _t(translations.ProjectDetailPage.createTitle, 'Create Project'),
  editTitle: () => _t(translations.ProjectDetailPage.editTitle, 'Edit Project'),
  addMember: () => _t(translations.ProjectDetailPage.addMember, 'Add Member'),
  editMember: () =>
    _t(translations.ProjectDetailPage.editMember, 'Edit Member'),
  formProjectNameLabel: () =>
    _t(translations.ProjectDetailPage.form.projectName.label, 'Project Name'),
  formProjectNamePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectName.placeholder,
      'Enter Project Name',
    ),
  formProjectNameEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectName.empty,
      'Please Enter Project Name!',
    ),
  formProjectStartedLabel: () =>
    _t(
      translations.ProjectDetailPage.form.projectStarted.label,
      'Project Started',
    ),
  formProjectStartedPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectStarted.placeholder,
      'Select Project Started Date',
    ),
  formProjectStartedEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectStarted.empty,
      'Please Select Project Started Date!',
    ),
  formProjectPriorityLabel: () =>
    _t(
      translations.ProjectDetailPage.form.projectPriority.label,
      'Project Priority',
    ),
  formProjectPriorityPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectPriority.placeholder,
      'Select Project Priority',
    ),
  formProjectPriorityEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectPriority.empty,
      'Please Select Project Priority!',
    ),
  formProjectPriorityLow: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.low, 'Low'),
  formProjectPriorityMedium: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.medium, 'Medium'),
  formProjectPriorityHigh: () =>
    _t(translations.ProjectDetailPage.form.projectPriority.high, 'High'),
  formProjectStatusLabel: () =>
    _t(
      translations.ProjectDetailPage.form.projectStatus.label,
      'Project Status',
    ),
  formProjectStatusPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectStatus.placeholder,
      'Select Project Status',
    ),
  formProjectStatusEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectStatus.empty,
      'Please Select Project Status!',
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
    _t(
      translations.ProjectDetailPage.form.projectOverview.label,
      'Project Overview',
    ),
  formProjectOverviewPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.form.projectOverview.placeholder,
      'Enter Project Overview',
    ),
  formProjectOverviewEmpty: () =>
    _t(
      translations.ProjectDetailPage.form.projectOverview.empty,
      'Please Enter Project Overview!',
    ),
  memberTitle: () =>
    _t(translations.ProjectDetailPage.member.title, 'Team Members'),
  memberPM: () =>
    _t(translations.ProjectDetailPage.member.pm, 'Project Manager'),
  memberTL: () => _t(translations.ProjectDetailPage.member.tl, 'Team Leader'),
  memberQC: () =>
    _t(translations.ProjectDetailPage.member.qc, 'Quality Controller'),
  memberDEV: () => _t(translations.ProjectDetailPage.member.dev, 'Developer'),
  memberOTHER: () => _t(translations.ProjectDetailPage.member.other, 'Other'),
  memberFormEmployeeLabel: () =>
    _t(translations.ProjectDetailPage.member.form.employee.label, 'Employee'),
  memberFormEmployeePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.member.form.employee.placeholder,
      'Enter Member Name, Email',
    ),
  memberFormEmployeeEmpty: () =>
    _t(
      translations.ProjectDetailPage.member.form.employee.empty,
      'Please Enter Member Name, Email!',
    ),
  memberFormProjectRoleLabel: () =>
    _t(
      translations.ProjectDetailPage.member.form.projectRole.label,
      'Project Role',
    ),
  memberFormProjectRolePlaceholder: () =>
    _t(
      translations.ProjectDetailPage.member.form.projectRole.placeholder,
      'Select Project Role',
    ),
  memberFormProjectRoleEmpty: () =>
    _t(
      translations.ProjectDetailPage.member.form.projectRole.empty,
      'Please Select Project Role!',
    ),
  memberFormAllocationLabel: () =>
    _t(
      translations.ProjectDetailPage.member.form.allocation.label,
      'Allocation',
    ),
  memberFormAllocationPlaceholder: () =>
    _t(
      translations.ProjectDetailPage.member.form.allocation.placeholder,
      'Select Allocation',
    ),
  memberFormAllocationEmpty: () =>
    _t(
      translations.ProjectDetailPage.member.form.allocation.empty,
      'Please Select Allocation!',
    ),
  messageCreateProjectSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.createProjectSuccess,
      'Create Project Successfully',
    ),
  messageEditProjectSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.editProjectSuccess,
      'Edit Project Successfully',
    ),
  messageCreateMemberSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.createMemberSuccess,
      'Create Member Successfully',
    ),
  messageEditMemberSuccess: () =>
    _t(
      translations.ProjectDetailPage.message.editMemberSuccess,
      'Edit Member Successfully',
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
