import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import * as React from 'react';
import { api } from 'utils/api';

export const useGetUserDetail = (
  id: string,
): {
  loading: boolean;
  error?: Error;
  user: Employee | undefined;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [user, setUser] = React.useState<Employee | undefined>();

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.employee.get(id);
        setUser(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  return {
    loading,
    error,
    user,
  };
};
