import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { useHistory } from 'react-router';
import fakeAPI from 'utils/fakeAPI';
import { PrivatePath } from 'utils/url.const';

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
    return await fakeAPI.get(`/hr/devices/${id}`);
  }, []);

  const create = async value => {
    setLoading(true);

    try {
      const response: any = await fakeAPI.post('/hr/devices/', value);

      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Create device successful',
        });
        history.push(`${PrivatePath.DEVICES}/${response.id}`);
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
      const response: any = await fakeAPI.put(
        `/hr/devices/${values.id}/`,
        values,
      );
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Update device successful',
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
