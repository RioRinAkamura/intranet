import { DeviceHistory } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { Pagination } from '@hdwebsoft/boilerplate-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';
import { defaultPaginationValue } from 'utils/variable';

export const useDeviceHistory = (): {
  histories: Pagination<DeviceHistory>;
  loading: boolean;
  error?: Error;
  fetchHistories: (id: string) => Promise<void>;
} => {
  const [histories, setHistories] = useState<Pagination<DeviceHistory>>(
    defaultPaginationValue,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const fetchHistories = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.hr.device.history.list(id);
      if (response) {
        setHistories(response);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    histories,
    loading,
    error,
    fetchHistories,
  };
};
