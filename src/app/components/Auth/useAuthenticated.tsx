import { useContext } from 'react';
import { AuthContext } from './Context';

export const useAuthenticated = (): boolean => {
  const { authState } = useContext(AuthContext);
  return authState.authenticated;
};
