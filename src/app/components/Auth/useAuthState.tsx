import { useContext } from 'react';
import { AuthContext } from './Context';

export const useAuthState = async (): Promise<{
  loading: boolean;
  authenticated: boolean;
}> => {
  const { authProvider } = useContext(AuthContext);

  return await authProvider
    .checkAuth()
    .then(() => {
      return { loading: false, authenticated: true };
    })
    .catch(() => {
      return { loading: false, authenticated: false };
    });
};
