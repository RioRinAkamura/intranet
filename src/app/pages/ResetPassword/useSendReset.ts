import React from 'react';
import { ResetConfirmParams } from '@hdwebsoft/intranet-api-sdk/libs/api/auth/models';
import { useHistory } from 'react-router';

import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { api } from 'utils/api';

interface ForgotPasswordHook {
  send: (data: ResetConfirmParams) => Promise<void>;
  loading: boolean;
  error?: Error | null;
}

export const useSendReset = (): ForgotPasswordHook => {
  const { notify } = useNotify();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const send = async (data: ResetConfirmParams): Promise<void> => {
    try {
      setLoading(true);
      await api.auth.resetPasswordConfirm({ ...data }).then((response: any) => {
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
