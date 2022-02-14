import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import * as React from 'react';
import { api } from 'utils/api';

type UserList = any[];

export const useGetUsers = (
  isCall: boolean = true,
): {
  loading: boolean;
  error?: Error;
  userList: UserList | undefined;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [userList, setUserList] = React.useState<Employee[]>();

  React.useEffect(() => {
    if (!isCall) return;
    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.employee.list(
          undefined,
          undefined,
          undefined,
          1,
          500,
        );
        setUserList(response.results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [isCall]);
  return {
    loading,
    error,
    userList,
  };
};
