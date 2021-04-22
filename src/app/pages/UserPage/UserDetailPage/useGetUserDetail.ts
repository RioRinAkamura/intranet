import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import * as React from 'react';
import fakeAPI from '../../../../utils/fakeAPI';

export const useGetUserDetail = (
  id?: string,
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
    fakeAPI
      .get('/hr/employees/' + id)
      .then((response: any) => {
        setUser(response);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  return {
    loading,
    error,
    user,
  };
};
