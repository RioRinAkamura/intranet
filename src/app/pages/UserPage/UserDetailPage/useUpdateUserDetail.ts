import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { api } from 'utils/api';

export const useUpdateUserDetail = (): {
  loading: boolean;
  error?: Error;
  update: (data: Employee) => Promise<Employee | undefined>;
} => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const { notify } = useNotify();

  const update = async (data: Employee): Promise<Employee | undefined> => {
    setLoading(true);
    try {
      const response = await api.hr.employee.update(data);
      return response;
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
  };
};
