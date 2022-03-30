/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import 'antd/dist/antd.css';
import config from 'config';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PrivatePath } from 'utils/url.const';
import '../app.less';
import { GlobalStyle } from '../styles/global-styles';
import AppLayout from './components/AppLayout';
import { AuthContextProvider } from './components/Auth/Context';
import { authProvider } from './components/Auth/defaultAuthProvider';
import { PrivateRoute, PublicRoute } from './components/Auth/Route';
import { useAuthState } from './components/Auth/useAuthState';
import { BreadCrumbsContextProvider } from './components/Breadcrumbs/context';
import { ToastContextProvider } from './components/Toast/context';
import { DeviceManagePage } from './pages/DeviceManagePage/Loadable';
import { TimeSheet } from './pages/EmployeePage/EmployeeDetailPage/components/TimeSheet/Loadable';
import { EmployeePage } from './pages/EmployeePage/Loadable';
import { ForgotPassword } from './pages/ForgotPassword/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { LeaveApplicationDetailPage } from './pages/LeaveApplicationPage/LeaveApplicationDetailPage/Loadable';
import { LeaveApplicationPage } from './pages/LeaveApplicationPage/LeaveApplicationListPage/Loadable';
import { Login } from './pages/Login/Loadable';
import { UserPage } from './pages/ManageUserPage/Loadable';
import { UserManageDetailPage } from './pages/ManageUserPage/UserDetailPage';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { ProjectPage } from './pages/ProjectPage/Loadable';
import { ResetPassword } from './pages/ResetPassword/Loadable';
import { SkillManagePage } from './pages/SkillManagePage/Loadable';
import { TaskManagerPage } from './pages/TaskManagerPage/Loadable';
import { TimesheetPage } from './pages/TimesheetPage/Loadable';
import { TimesheetListPage } from './pages/TimesheetPage/TimesheetListPage';
import { UserTimesheetPage } from './pages/UserTimesheetPage/Loadable';

export function App() {
  const { i18n } = useTranslation();
  const { identity } = useAuthState();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Staff Management"
        defaultTitle="Staff Management"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A Staff Management application" />
      </Helmet>
      <AuthContextProvider authProvider={authProvider}>
        <ToastContextProvider>
          <BreadCrumbsContextProvider>
            <Switch>
              <PublicRoute
                exact
                restricted={true}
                path={config.LOGIN_PATH}
                component={Login}
              />
              <PublicRoute
                restricted={true}
                path="/forgot-password"
                component={ForgotPassword}
              />
              <PublicRoute
                restricted={true}
                path="/reset-password"
                component={ResetPassword}
              />
              <AppLayout>
                {identity &&
                identity?.role?.length === 1 &&
                identity?.role[0].name === 'staff' ? (
                  <>
                    <PrivateRoute
                      exact
                      path={config.ROOT_PATH}
                      component={HomePage}
                    />
                    <PrivateRoute
                      path={PrivatePath.USERS_ID}
                      component={UserManageDetailPage}
                    />
                    <PrivateRoute
                      path={PrivatePath.TIMESHEETS}
                      component={UserTimesheetPage}
                    />
                  </>
                ) : (
                  <>
                    <PrivateRoute
                      exact
                      path={config.ROOT_PATH}
                      component={HomePage}
                    />
                    {/* Dashboard */}
                    <PrivateRoute
                      exact
                      path={config.DASHBOARD_PATH}
                      component={HomePage}
                    />
                    {/* Employee */}
                    <PrivateRoute
                      path={config.USERS_PATH}
                      component={EmployeePage}
                    />
                    {/* Project */}
                    <PrivateRoute
                      path={PrivatePath.PROJECTS}
                      component={ProjectPage}
                    />
                    {/* LeaveApplication */}
                    <PrivateRoute
                      exact
                      path={PrivatePath.LEAVE_APPLICATION}
                      component={LeaveApplicationPage}
                    />
                    <PrivateRoute
                      path={PrivatePath.LEAVE_APPLICATION_CREATE}
                      component={LeaveApplicationDetailPage}
                    />
                    <PrivateRoute
                      path={PrivatePath.LEAVE_APPLICATION_ID}
                      component={LeaveApplicationDetailPage}
                    />
                    {/* User */}
                    <PrivateRoute
                      path={PrivatePath.USERS}
                      component={UserPage}
                    />
                    {/* Devices */}
                    <PrivateRoute
                      path={PrivatePath.DEVICES}
                      component={DeviceManagePage}
                    />
                    {/* Task */}
                    <PrivateRoute
                      path={PrivatePath.TASKS}
                      component={TaskManagerPage}
                    />
                    {/* Skill */}
                    <PrivateRoute
                      path={PrivatePath.SKILLS}
                      component={SkillManagePage}
                    />
                    {/* Timesheet */}
                    <PrivateRoute
                      path={PrivatePath.PROJECTS_TIMESHEETS}
                      component={TimesheetListPage}
                    />
                  </>
                )}
              </AppLayout>

              <Route component={NotFoundPage} />
            </Switch>
          </BreadCrumbsContextProvider>
        </ToastContextProvider>
      </AuthContextProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
