import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from './useAuthState';
import config from '../../../config';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authenticated } = useAuthState();
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={config.LOGIN_PATH} />
        )
      }
    />
  );
};

export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  console.log('config.DASHBOARD_PATH: ', config.DASHBOARD_PATH);
  const { authenticated } = useAuthState();
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={props =>
        authenticated && restricted ? (
          <Redirect to={config.DASHBOARD_PATH} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
