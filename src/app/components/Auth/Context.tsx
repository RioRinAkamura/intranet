import React from 'react';
import { AuthProvider, defaultProvider } from './provider';

import { AuthState } from './slice/types';

interface AuthContextProviderProps {
  authState: AuthState;
  authProvider: AuthProvider;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthContext = React.createContext<AuthContextProviderProps>({
  authState: { authenticated: false, identity: { id: '' } },
  authProvider: { ...defaultProvider },
  setAuthState: () => {},
});

export const useAuthContextProvider = (authProvider: AuthProvider) => {
  const [authState, setAuthState] = React.useState<AuthState>({
    authenticated: false,
    identity: { id: '' },
  });
  return { authState, authProvider, setAuthState };
};

export const AuthContextProvider = ({ authProvider, children }) => {
  const contextValue = useAuthContextProvider(authProvider);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Login: dispatch LoginAction =>
// eslint-disable-next-line no-lone-blocks
{
  /* <AuthContextProvider authProvider={}></AuthContextProvider>; */
}
