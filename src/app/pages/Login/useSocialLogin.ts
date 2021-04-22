import { AuthContext } from 'app/components/Auth/Context';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';

import fakeAPI from 'utils/fakeAPI';

export const useSocialLogin = (): {
  loading: boolean;
  error?: Error;
  login: (data: string, social: string) => Promise<void>;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const { setAuthState } = React.useContext(AuthContext);
  const { notify } = useNotify();

  const login = async (data: string, social: string): Promise<void> => {
    try {
      await fakeAPI.post('social-auth/' + social + '/', {
        access_token: data,
      });
      setAuthState(true, undefined);
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
