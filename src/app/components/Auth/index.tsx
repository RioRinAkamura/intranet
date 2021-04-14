import { useContext } from 'react';
import { AuthContext } from './Context';
// import { api } from 'utils/sessionConfig';
// import { AuthProvider } from './provider';

export const useGetIdentity = () => {
  return { identity: null, loading: false };
};

export const useAuthState = (): {
  loading: boolean;
  authenticated: boolean;
} => {
  const { authState } = useContext(AuthContext);
  // const isAuth = localStorage.getItem('token');
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
    const getIdentity = authProvider.getIdentity();

    if (getIdentity) {
      setAuthState({
        authenticated: true,
        identity: { id: '123', displayName: 'displayName', avatar: 'avatar' },
      });
    } else {
      //
    }

    // return new Promise((resolve, reject) => {
    //   if (data.email === 'admin@yopmail.com' && data.password === '123123') {
    //     resolve({
    //       data: {
    //         token:
    //           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    //       },
    //     });
    //   } else {
    //     reject();
    //   }
    // });
  };

  const funcUserLogin = {
    login,
  };
  return funcUserLogin;
}; // return AuthProvider.login

export const useLogout = (): void => {}; // return AuthProvider.logout
