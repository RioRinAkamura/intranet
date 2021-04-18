import React from 'react';
import { AuthProvider, defaultProvider } from './authProvider';
import { UserIdentity } from './types';

interface AuthContextValues {
  loading: boolean;
  authenticated: boolean;
  identity?: UserIdentity | null;
  error?: Error;
  authProvider: AuthProvider;
  setAuthState: (authenticated: boolean, identity?: UserIdentity) => void;
}

export const AuthContext = React.createContext<AuthContextValues>({
  authProvider: defaultProvider,
  loading: false,
  authenticated: false,
  identity: null,
  setAuthState: (_authenticated: boolean, _identity?: UserIdentity) => {},
});

export const useAuthContextProvider = (
  authProvider: AuthProvider,
): AuthContextValues => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [identity, setIdentity] = React.useState<UserIdentity | null>();

  const setAuthState = React.useCallback(
    (authenticated: boolean, identity?: UserIdentity) => {
      setAuthenticated(authenticated);
      if (identity) setIdentity(identity);
    },
    [],
  );

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const identity = await authProvider.getIdentity();
        setIdentity(identity);
        setAuthenticated(identity ? true : false);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [authProvider]);
  return {
    loading,
    authenticated,
    identity,
    error,
    authProvider,
    setAuthState,
  };
};

export const AuthContextProvider = ({ authProvider, children }) => {
  const contextValue = useAuthContextProvider(authProvider);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};