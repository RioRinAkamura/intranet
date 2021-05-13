import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { UserDetailMessages } from './messages';

export const useUpdateUserDetail = (): {
  loading: boolean;
  error?: Error;
  update: (data: Employee) => Promise<Employee | undefined>;
  create: (data: Employee) => void;
} => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const { notify } = useNotify();

  const update = async (data: Employee): Promise<Employee | undefined> => {
    setLoading(true);
    try {
      const response = await api.hr.employee.update(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(UserDetailMessages.updateSuccessMessage()),
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

  const create = async (data: Employee) => {
    setLoading(true);
    try {
      const response = await api.hr.employee.create(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(UserDetailMessages.updateSuccessMessage()),
        });
        history.push('/employees/' + response.id);
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
    update,
    create,
  };
};
