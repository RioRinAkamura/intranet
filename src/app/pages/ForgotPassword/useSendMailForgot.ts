import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import React from 'react';
import { useHistory } from 'react-router';
import { api } from 'utils/api';

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordHook {
  send: (data: ForgotPasswordPayload) => Promise<void>;
  loading: boolean;
  error?: Error | null;
}

export const useSendMailForgot = (): ForgotPasswordHook => {
  const { notify } = useNotify();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const send = async (data: ForgotPasswordPayload): Promise<void> => {
    try {
      setLoading(true);
      await api.auth.resetPassword(data.email);
      notify({
        type: ToastMessageType.Info,
        message: 'Email has been sent',
        duration: 2,
      });
      history.push('/reset-password');
    } catch (e) {
      setError(e);
      notify({
        type: ToastMessageType.Info,
        message: e,
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };
  return { send, loading, error };
};
