export enum PrivatePath {
  PROJECTS = '/projects',
  PROJECTS_CREATE = '/projects/create',
  PROJECTS_ID = '/projects/:id',
  PROJECTS_ID_CHANGELOGS = '/projects/:id/change-logs',
  PROJECTS_ID_MEMBERS = '/projects/:id/members',
  PROJECTS_ID_MEMBERS_ADD = '/projects/:id/members/add',
  PROJECTS_ID_EMPLOYEES = '/projects/:id/employees',

  EMPLOYEES = '/employees',
  EMPLOYEES_CREATE = '/employees/create',
  EMPLOYEES_ID = '/employees/:id',
  EMPLOYEES_ID_NOTES = '/employees/:id/notes',
  EMPLOYEES_ID_PROJECTS = '/employees/:id/projects',
  EMPLOYEES_ID_DEVICES = '/employees/:id/devices',
  EMPLOYEES_ID_CHANGELOGS = '/employees/:id/change-logs',
  EMPLOYEES_ID_CONTRACT = '/employees/:id/contract',
  EMPLOYEES_ID_CONTRACT_EDIT = '/employees/:id/contract/edit',
  EMPLOYEES_ID_BANK_ACCOUNTS = '/employees/:id/bank-accounts',
  EMPLOYEES_ID_BANK_ACCOUNTS_EDIT = '/employees/:id/bank-accounts/edit',
  EMPLOYEES_ID_CITIZEN_INFO = '/employees/:id/citizen-info',
  EMPLOYEES_EDIT = '/employees/:id/edit',

  DEVICES = '/devices',
  DEVICES_CREATE = '/devices/create',
  DEVICES_ID = '/devices/:id',
  DEVICES_ID_HISTORY = '/devices/:id/history',
  DEVICES_EDIT = '/devices/:id/edit',

  USERS = '/users',
  USERS_CREATE = '/users/create',
  USERS_ID = '/users/:id',

  TASKS = '/tasks',

  LEAVE_APPLICATION = '/leave_applications',
  LEAVE_APPLICATION_CREATE = '/leave_applications/create',
  LEAVE_APPLICATION_ID = '/leave_applications/:id',
}
