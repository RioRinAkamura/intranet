import React, { useEffect, useState } from 'react';

import { Route, Redirect } from 'react-router-dom';
import config from '../../../config';
import { useAuthState } from './useAuthState';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [auth, setAuth] = useState(true);
  const authenticated = useAuthState();

  const getAuth = async () => {
    try {
      const response = await authenticated;
      if (response) {
        setAuth(response.authenticated);
      }
    } catch (error) {
      setAuth(false);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={props =>
        auth ? <Component {...props} /> : <Redirect to={config.LOGIN_PATH} />
      }
    />
  );
};

export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  console.log('config.DASHBOARD_PATH: ', config.DASHBOARD_PATH);
  const [auth, setAuth] = useState(false);
  const authenticated = useAuthState();
  // const { authState } = useContext(AuthContext);

  const getAuth = async () => {
    try {
      const response = await authenticated;
      if (response) {
        setAuth(response.authenticated);
      }
    } catch (error) {
      setAuth(false);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={props =>
        auth && restricted ? (
          <Redirect to={config.DASHBOARD_PATH} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
