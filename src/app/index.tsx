/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from '../styles/global-styles';
import 'antd/dist/antd.css';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { PrivateRoute, PublicRoute } from './components/Auth/Route';
import config from 'config';
import { Login } from './pages/Login/Loadable';
import { Users } from './pages/UsersPage/Loadable';
import { AuthContextProvider } from './components/Auth/Context';
import { customProvider } from './components/Auth/provider';

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
      <AuthContextProvider authProvider={customProvider}>
        <Switch>
          {/* <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} /> */}
          <PublicRoute
            restricted={true}
            exact
            path={config.LOGIN_PATH}
            component={Login}
          />
          <PrivateRoute
            exact
            path={config.DASHBOARD_PATH}
            component={HomePage}
          />
          <PrivateRoute exact path={config.USERS_PATH} component={Users} />
          <Route component={NotFoundPage} />
        </Switch>
      </AuthContextProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
