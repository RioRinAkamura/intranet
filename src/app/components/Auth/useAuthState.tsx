import { useContext, useState } from 'react';
import { AuthContext } from './Context';

export const useAuthState = async (): Promise<{
  loading: boolean;
  authenticated: boolean;
}> => {
  const { authProvider, setAuthState, authState } = useContext(AuthContext);

  return await authProvider
    .checkAuth()
    .then(() => {
      // if (!authState.authenticated) {
      //   setAuthState({ authenticated: true, identity: response });
      // }
      return { loading: false, authenticated: true };
    })
    .catch(() => {
      return { loading: false, authenticated: false };
    });
};
