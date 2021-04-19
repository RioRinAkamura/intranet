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
import { Users } from './pages/UsersPage/Loadable';
import { authProvider } from './components/Auth/defaultAuthProvider';
import { AuthContextProvider } from './components/Auth/Context';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>
      <AuthContextProvider authProvider={authProvider}>
        <Switch>
          <PublicRoute
            restricted={true}
            exact
            path={config.LOGIN_PATH}
            component={Login}
          />
          <AppLayout>
            <PrivateRoute
              exact
              path={config.DASHBOARD_PATH}
              component={HomePage}
            />
            <PrivateRoute exact path="/employees" component={Users} />
          </AppLayout>

          <Route component={NotFoundPage} />
        </Switch>
      </AuthContextProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
