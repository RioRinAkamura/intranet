import { ThemeState } from 'styles/theme/slice/types';
import { UserspageState } from 'app/pages/UserPage/UserListPage/slice/types';
import { State } from 'app/components/ChangePasswordModal/slice/types';
import { ProjectsState } from 'app/pages/ProjectPage/ProjectListPage/slice/types';
import { UserDetailsState } from 'app/pages/UserPage/UserDetailPage/slice/types';
import { EmployeeProjectState } from 'app/pages/UserPage/UserDetailPage/components/Projects/slice/types';
import { EmployeeNoteState } from 'app/pages/UserPage/UserDetailPage/components/Notes/slice/types';
import { UsersManagePageState } from 'app/pages/ManageUserPage/slice/types';
import { LeaveApplicationState } from 'app/pages/LeaveApplicationPage/LeaveApplicationListPage/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life.
  So, not available always
*/
export interface RootState {
  theme?: ThemeState;
  userspage?: UserspageState;
  changePassword?: State;
  projects?: ProjectsState;
  userDetails?: UserDetailsState;
  employeeProject?: EmployeeProjectState;
  employeeNote?: EmployeeNoteState;
  usersmanagepage?: UsersManagePageState;
  leaveApplication?: LeaveApplicationState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
