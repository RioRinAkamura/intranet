import React from 'react';
import { useAuthProvider } from './useAuthProvider';

interface LogoutHook {
  logout: () => void;
  loading: boolean;
  error: Error | null;
}

export const useLogout = (): LogoutHook => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const authProvider = useAuthProvider();
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authProvider.logout();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
