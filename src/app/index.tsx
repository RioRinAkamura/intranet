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
import { Users } from './pages/UserPage/UserListPage/Loadable';
import { UserDetailPage } from './pages/UserPage/UserDetailPage/Loadable';
import { authProvider } from './components/Auth/defaultAuthProvider';
import { AuthContextProvider } from './components/Auth/Context';
import { ForgotPassword } from './pages/ForgotPassword/Loadable';
import { ResetPassword } from './pages/ResetPassword/Loadable';
import { ToastContextProvider } from './components/Toast/context';
import { ProjectsPage } from './pages/ProjectPage/ProjectListPage/Loadable';
import { ProjectDetailPage } from './pages/ProjectPage/ProjectDetailPage/Loadable';

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
          <Switch>
            <PublicRoute
              restricted={true}
              exact
              path={config.LOGIN_PATH}
              component={Login}
            />
            <PublicRoute
              restricted={true}
              exact
              path="/forgot-password"
              component={ForgotPassword}
            />
            <PublicRoute
              restricted={true}
              exact
              path="/reset-password"
              component={ResetPassword}
            />
            <AppLayout>
              <Switch>
                <PrivateRoute
                  exact
                  path={config.DASHBOARD_PATH}
                  component={HomePage}
                />
                <PrivateRoute
                  exact
                  path={config.USERS_PATH}
                  component={Users}
                />
                <PrivateRoute
                  exact
                  path={`${config.USERS_PATH}/:id`}
                  component={UserDetailPage}
                />
                <PrivateRoute
                  exact
                  path={`${config.USERS_PATH}/:id/notes`}
                  component={UserDetailPage}
                />
                <PrivateRoute
                  exact
                  path={`${config.USERS_PATH}/:id/projects`}
                  component={UserDetailPage}
                />
                <PrivateRoute
                  exact
                  path={`${config.USERS_PATH}/create`}
                  component={UserDetailPage}
                />
                <PrivateRoute
                  exact
                  path={'/projects'}
                  component={ProjectsPage}
                />
                <PrivateRoute
                  exact
                  path={'/projects/create'}
                  component={ProjectDetailPage}
                />
                <PrivateRoute
                  exact
                  path={'/projects/:id'}
                  component={ProjectDetailPage}
                />
              </Switch>
            </AppLayout>

            <Route component={NotFoundPage} />
          </Switch>
        </ToastContextProvider>
      </AuthContextProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
