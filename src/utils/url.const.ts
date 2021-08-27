export enum PrivatePath {
  PROJECTS = '/projects',
  PROJECTS_CREATE = '/projects/create',
  PROJECTS_ID = '/projects/:id',
  PROJECTS_ID_CHANGELOGS = '/projects/:id/change-logs',
  PROJECTS_ID_MEMBERS = '/projects/:id/members',
  PROJECTS_ID_MEMBERS_ADD = '/projects/:id/members/add',

  EMPLOYEES = '/employees',
  EMPLOYEES_CREATE = '/employees/create',
  EMPLOYEES_ID = '/employees/:id',
  EMPLOYEES_ID_NOTES = '/employees/:id/notes',
  EMPLOYEES_ID_PROJECTS = '/employees/:id/projects',
  EMPLOYEES_ID_DEVICES = '/employees/:id/devices',
  EMPLOYEES_ID_CHANGELOGS = '/employees/:id/change-logs',
  EMPLOYEES_EDIT = '/employees/:id/edit',

  DEVICES = '/devices',
  DEVICES_CREATE = '/devices/create',
  DEVICES_ID = '/devices/:id',
  DEVICES_ID_HISTORY = '/devices/:id/history',

  USERS = '/users',
  USERS_CREATE = '/users/create',
  USERS_ID = '/users/:id',

  TASKS = '/tasks',
}
