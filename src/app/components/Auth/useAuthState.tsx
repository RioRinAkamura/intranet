import { useContext } from 'react';
import { AuthContext } from './Context';

export const useAuthState = (): {
  loading: boolean;
  authenticated: boolean;
} => {
  const { authState } = useContext(AuthContext);
  return { loading: false, authenticated: authState.authenticated };
};
