import * as React from 'react';
import fakeAPI from 'utils/fakeAPI';
import { Pagination, UserProfile } from '../types';

export const useGetUserList = (
  pagination: Pagination,
): {
  loading: boolean;
  error?: Error;
  users: UserProfile[] | [];
  resPagination: Pagination;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [users, setUsers] = React.useState<UserProfile[] | []>([]);
  const [resPagination, setResPagination] = React.useState<Pagination>(
    pagination,
  );

  React.useEffect(() => {
    setLoading(true);
    fakeAPI
      .get(
        '/hr/employees/?page=' +
          pagination.current +
          '&limit=' +
          pagination.pageSize,
      )
      .then((response: any) => {
        setUsers(response.results);
        setResPagination({
          ...pagination,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: response.count,
        });
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pagination]);
  return {
    loading,
    error,
    users,
    resPagination,
  };
};
