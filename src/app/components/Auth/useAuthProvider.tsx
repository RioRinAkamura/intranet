import { useContext } from 'react';
import { AuthContext } from './Context';

export const useAuthProvider = () => {
  const { authProvider } = useContext(AuthContext);
  return authProvider;
};
