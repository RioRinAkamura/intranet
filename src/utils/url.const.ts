export enum PrivatePath {
  PROJECTS = '/projects',
  PROJECTS_CREATE = '/projects/create',
  PROJECTS_ID = '/projects/:id',
  PROJECTS_ID_NOTES = '/projects/:id/notes',
  PROJECTS_ID_CHANGELOGS = '/projects/:id/change-logs',
  PROJECTS_ID_MEMBERS = '/projects/:id/members',
  PROJECTS_ID_MEMBERS_ADD = '/projects/:id/members/add',
  PROJECTS_ID_EMPLOYEES = '/projects/:id/employees',

  PROJECTS_TIMESHEETS = '/projects-daily-reports',

  EMPLOYEES = '/employees',
  EMPLOYEES_CREATE = '/employees/create',
  EMPLOYEES_ID = '/employees/:id',
  EMPLOYEES_ID_EDIT = '/employees/:id/edit',
  EMPLOYEES_ID_NOTES = '/employees/:id/notes',
  EMPLOYEES_ID_PROJECTS = '/employees/:id/projects',
  EMPLOYEES_ID_DEVICES = '/employees/:id/devices',
  EMPLOYEES_ID_CHANGELOGS = '/employees/:id/change-logs',
  EMPLOYEES_ID_CONTRACT = '/employees/:id/contract',
  EMPLOYEES_ID_CONTRACT_EDIT = '/employees/:id/contract/edit',
  EMPLOYEES_ID_BANK_ACCOUNTS = '/employees/:id/bank-accounts',
  EMPLOYEES_ID_BANK_ACCOUNTS_EDIT = '/employees/:id/bank-accounts/edit',
  EMPLOYEES_ID_CITIZEN_INFO = '/employees/:id/citizen-info',
  EMPLOYEES_ID_CITIZEN_INFO_EDIT = '/employees/:id/citizen-info/edit',
  EMPLOYEES_ID_SOCIAL_ACCOUNTS = '/employees/:id/social-accounts',
  EMPLOYEES_ID_SOCIAL_ACCOUNTS_EDIT = '/employees/:id/social-accounts/edit',
  EMPLOYEES_ID_SKILLS = '/employees/:id/skills',

  EMPLOYEES_ID_TIMESHEET = '/employees/:id/timesheets',
  EMPLOYEES_ID_TIMESHEET_DETAIL = '/employees/:id/timesheets/:id',
  EMPLOYEES_ID_REPORT = '/employees/:id/reports',

  DEVICES = '/devices',
  DEVICES_CREATE = '/devices/create',
  DEVICES_ID = '/devices/:id',
  DEVICES_ID_HISTORY = '/devices/:id/history',
  DEVICES_EDIT = '/devices/:id/edit',

  USERS = '/users',
  USERS_CREATE = '/users/create',
  USERS_ID = '/users/:id',
  USERS_ID_TIMESHEETS = '/users/:id/timesheets',

  TIMESHEETS = '/timesheets',

  TASKS = '/tasks',

  LEAVE_APPLICATION = '/leave_applications',
  LEAVE_APPLICATION_CREATE = '/leave_applications/create',
  LEAVE_APPLICATION_ID = '/leave_applications/:id',

  SKILLS = '/skills',
  SKILLS_CREATE = '/skills/create',
  SKILLS_CATEGORIES = '/skills/categories',
  SKILLS_CATEGORIES_CREATE = '/skills/categories/create',
}
