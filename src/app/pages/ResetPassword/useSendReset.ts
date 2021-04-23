import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import React from 'react';
import { useHistory } from 'react-router';
import fakeAPI from 'utils/fakeAPI';

interface ForgotPasswordPayload {
  new_password1: string;
  new_password2: string;
  otp: string;
}

interface ForgotPasswordHook {
  send: (data: ForgotPasswordPayload) => Promise<void>;
  loading: boolean;
  error?: Error | null;
}

export const useSendReset = (): ForgotPasswordHook => {
  const { notify } = useNotify();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const send = async (data: ForgotPasswordPayload): Promise<void> => {
    try {
      setLoading(true);
      await fakeAPI
        .post('/auth/password/reset/confirm/', { ...data })
        .then((response: any) => {
          notify({
            type: ToastMessageType.Info,
            message: response.detail,
            duration: 2,
          });
          history.push('/login');
        });
    } catch (e) {
      setError(e);
      notify({
        type: ToastMessageType.Error,
        message: e.message,
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };
  return { send, loading, error };
};
