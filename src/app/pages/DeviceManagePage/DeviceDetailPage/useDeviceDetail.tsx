import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { useHistory } from 'react-router';
import fakeAPI from 'utils/fakeAPI';

export const useDeviceDetail = (): {
  loading: boolean;
  error?: Error;
  detail: (id: string) => Promise<any | undefined>;
  create: (data: any) => Promise<any | undefined>;
  update: (data: any) => Promise<any | undefined>;
} => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const { notify } = useNotify();

  const detail = React.useCallback(async (id: string) => {
    return await fakeAPI.get(`/devices/${id}`);
  }, []);

  const create = async value => {
    setLoading(true);

    try {
      const response: any = await fakeAPI.post('/devices/', value);

      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Create Device Successfully',
        });
        history.push('/devices/' + response.id);
        return response;
      }
    } catch (e) {
      setError(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const update = async values => {
    setLoading(true);
    try {
      const response: any = await fakeAPI.put(`/devices/${values.id}/`, values);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Update Device Successfully',
        });
        return response;
      }
    } catch (error) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    detail,
    create,
    update,
  };
};
