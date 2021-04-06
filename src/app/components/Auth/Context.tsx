import React from 'react';
import { AuthProvider } from './provider';

import { AuthState } from './slice/types';

interface AuthContextProviderProps {
  authState: AuthState;
}

export const AuthContext = React.createContext<AuthContextProviderProps>({
  authState: { authenticated: false },
});

export const useAuthContextProvider = (authProvider: AuthProvider) => {
  const [authState, setAuthState] = React.useState<AuthState>({
    authenticated: false,
  });
  return { authState, authProvider };
};

export const AuthContextProvider = ({ authProvider, children }) => {
  const contextValue = useAuthContextProvider(authProvider);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Login: dispatch LoginAction =>
{
  /* <AuthContextProvider authProvider={}></AuthContextProvider>; */
}
