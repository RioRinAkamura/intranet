import { SocialLoginParams } from '@hdwebsoft/boilerplate-api-sdk/libs/api/auth/models';
import { AuthContext } from 'app/components/Auth/Context';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { api } from 'utils/api';
import { useAuthProvider } from '../Auth/useAuthProvider';

export const useFacebookLogin = (): {
  loading: boolean;
  error?: Error;
  login: (data: SocialLoginParams) => Promise<void>;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const { setAuthState } = React.useContext(AuthContext);
  const authProvider = useAuthProvider();
  const { notify } = useNotify();

  const login = async (data: SocialLoginParams): Promise<void> => {
    try {
      await api.auth.facebookLogin(data);
      const identity = await authProvider.getIdentity();
      setAuthState(true, identity ?? undefined);
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Login with Facebook successful',
      });
    } catch (error) {
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message || 'Something when wrong',
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    login,
  };
};
