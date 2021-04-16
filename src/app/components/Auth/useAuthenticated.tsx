import React, { useContext } from 'react';
import { AuthContext } from './Context';

export const useAuthenticated = (): { loading: boolean } => {
  const [loading, setLoading] = React.useState(false);
  const { authProvider, setAuthState } = useContext(AuthContext);

  (async () => {
    try {
      setLoading(true);
      const userIdentity = await authProvider.checkAuth();
      setAuthState({ authenticated: true, identity: userIdentity });
    } catch (error) {
      setAuthState({ authenticated: false, identity: undefined });
    } finally {
      setLoading(false);
    }
  })();

  return { loading };
};
