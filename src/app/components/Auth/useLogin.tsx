import React, { useContext } from 'react';
import { AuthContext } from './Context';
import { useAuthProvider } from './useAuthProvider';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginHook {
  login: (data: LoginPayload) => void;
  loading: boolean;
  error: Error | null;
}

export const useLogin = (): LoginHook => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { setAuthState } = useContext(AuthContext);
  const { authProvider } = useAuthProvider();
  const login = async (data: LoginPayload): Promise<void> => {
    try {
      setLoading(true);
      await authProvider.login(data.email, data.password);
      const userIdentity = await authProvider.getIdentity();
      setAuthState({
        authenticated: true,
        identity: userIdentity,
      });
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  return { login, loading, error };
};
