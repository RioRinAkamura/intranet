import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import config from '../../../config';
import { useAuthState } from './useAuthState';
import { useLocation } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authenticated, identity } = useAuthState();
  const location = useLocation();

  // handle staff role
  if (
    identity &&
    identity?.role?.length === 1 &&
    identity?.role[0].name === 'staff'
  ) {
    if (location.pathname.includes(identity?.id as string)) {
      return <Route {...rest} render={props => <Component {...props} />} />;
    } else {
      // history.push(config.DASHBOARD_PATH);
      return (
        <Route
          {...rest}
          render={props =>
            location.pathname.includes('/dashboard') ? (
              <Component {...props} />
            ) : (
              <Redirect to={config.DASHBOARD_PATH} />
            )
          }
        />
      );
    }
  }
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
