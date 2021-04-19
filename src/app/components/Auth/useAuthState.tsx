import { useContext } from 'react';
import { AuthState } from './types';
import { AuthContext } from './Context';

export const useAuthState = (): AuthState => {
  const { authenticated, identity, loading } = useContext(AuthContext);
  return { authenticated, identity, loading };
};
