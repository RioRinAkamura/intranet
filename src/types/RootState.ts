import { State } from 'app/components/ChangePasswordModal/slice/types';
import { TableListState } from 'app/components/TableListModel/slice/types';
import { DevicesManagerState } from 'app/pages/DeviceManagePage/DeviceListPage/slice/types';
import { EmployeeChangeLogsState } from 'app/pages/EmployeePage/EmployeeDetailPage/components/ChangeLogs/slice/types';
import { EmployeeNoteState } from 'app/pages/EmployeePage/EmployeeDetailPage/components/Notes/slice/types';
import { EmployeeProjectState } from 'app/pages/EmployeePage/EmployeeDetailPage/components/Projects/slice/types';
import { EmployeeDetailsState } from 'app/pages/EmployeePage/EmployeeDetailPage/slice/types';
import { EmployeePageState } from 'app/pages/EmployeePage/EmployeeListPage/slice/types';
import { UsersManagePageState } from 'app/pages/ManageUserPage/slice/types';
import { ProjectChangeLogsState } from 'app/pages/ProjectPage/ProjectDetailPage/components/ChangeLogs/slice/types';
import { ProjectsState } from 'app/pages/ProjectPage/ProjectListPage/slice/types';
import { TaskManagerState } from 'app/pages/TaskManagerPage/slice/types';
import { ThemeState } from 'styles/theme/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life.
  So, not available always
*/
export interface RootState {
  theme?: ThemeState;
  employeespage?: EmployeePageState;
  changePassword?: State;
  projects?: ProjectsState;
  projectChangeLogs?: ProjectChangeLogsState;
  employeeDetails?: EmployeeDetailsState;
  employeeProject?: EmployeeProjectState;
  employeeNote?: EmployeeNoteState;
  employeeChangeLogs?: EmployeeChangeLogsState;
  usersmanagepage?: UsersManagePageState;
  // leaveApplication?: LeaveApplicationState;
  DeviceManager?: DevicesManagerState;
  table: TableListState;
  leave: TableListState;
  TaskManager: TaskManagerState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
