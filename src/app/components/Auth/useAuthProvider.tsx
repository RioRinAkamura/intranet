import { useContext } from 'react';
import { AuthContext } from './Context';
import { AuthProvider } from './provider';

export const useAuthProvider = (): AuthProvider => {
  const { authProvider } = useContext(AuthContext);

  const {
    login,
    logout,
    checkAuth,
    getIdentity,
    checkError,
    getPermissions,
  } = authProvider;

  return { login, logout, checkAuth, getIdentity, getPermissions, checkError };
};
