import { useContext } from 'react';
import { AuthContext } from './Context';

export const useGetIdentity = () => {
  return { identity: null, loading: false };
};

export const useAuthState = (): {
  loading: boolean;
  authenticated: boolean;
} => {
  const { authState } = useContext(AuthContext);
  return { loading: false, authenticated: authState.authenticated };
};

export const useGetPermissions = (): void => {};

export const useAuthenticated = () => {
  const { authState } = useContext(AuthContext);
  return authState.authenticated;
};

export const useMe = (): void => {};

export const useLogin = () => {
  const { authProvider, setAuthState } = useContext(AuthContext);
  const login = data => {
    authProvider.login(data.email, data.password);
    authProvider
      .getIdentity()
      .then(response => {
        setAuthState({
          authenticated: true,
          identity: response,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const funcUserLogin = {
    login,
  };
  return funcUserLogin;
};
// return AuthProvider.login
export const useLogout = (): void => {}; // return AuthProvider.logout
