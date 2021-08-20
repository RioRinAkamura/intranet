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
import { GlobalStyle } from '../styles/global-styles';
import AppLayout from './components/AppLayout';
import { PrivateRoute, PublicRoute } from './components/Auth/Route';
import { HomePage } from './pages/HomePage/Loadable';
import { Login } from './pages/Login/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { EmployeePage } from './pages/EmployeePage/Loadable';
import { authProvider } from './components/Auth/defaultAuthProvider';
import { AuthContextProvider } from './components/Auth/Context';
import { ForgotPassword } from './pages/ForgotPassword/Loadable';
import { ResetPassword } from './pages/ResetPassword/Loadable';
import { ToastContextProvider } from './components/Toast/context';
import { BreadCrumbsContextProvider } from './components/Breadcrumbs/context';
import { ProjectPage } from './pages/ProjectPage/Loadable';
import { LeaveApplicationPage } from './pages/LeaveApplicationPage/LeaveApplicationListPage/Loadable';
import { UserPage } from './pages/ManageUserPage/Loadable';
import { LeaveApplicationDetailPage } from './pages/LeaveApplicationPage/LeaveApplicationDetailPage/Loadable';
import { DeviceManagePage } from './pages/DeviceManagePage/Loadable';
import { TaskManagerPage } from './pages/TaskManagerPage/Loadable';
import '../app.less';
import { PrivatePath } from 'utils/url.const';

export function App() {
  const { i18n } = useTranslation();
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
                {/* Home */}
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
                  path={'/leave_applications'}
                  component={LeaveApplicationPage}
                />
                <PrivateRoute
                  path={'/leave_applications/create'}
                  component={LeaveApplicationDetailPage}
                />
                <PrivateRoute
                  path={'/leave_applications/:id'}
                  component={LeaveApplicationDetailPage}
                />

                {/* User */}
                <PrivateRoute path={PrivatePath.USERS} component={UserPage} />

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
