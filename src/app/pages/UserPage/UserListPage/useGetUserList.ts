import { models } from '@hdwebsoft/boilerplate-api-sdk';
import * as React from 'react';
import { api } from 'utils/api';
import { Pagination, ParamsPayload } from '../types';

type Employee = models.hr.Employee;

export const useGetUserList = (
  pagination: Pagination,
  params: ParamsPayload,
): {
  loading: boolean;
  error?: Error;
  users: Employee[] | [];
  resPagination: Pagination;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [users, setUsers] = React.useState<Employee[]>([]);
  const [resPagination, setResPagination] = React.useState<Pagination>(
    pagination,
  );

  const payload: ParamsPayload = React.useMemo(() => {
    const urlParams: ParamsPayload = {};
    if (params.search) {
      urlParams.search = params.search;
    } else {
      urlParams.search = undefined;
    }
    if (params.first_name) {
      urlParams.first_name = params.first_name;
    } else {
      urlParams.first_name = undefined;
    }
    if (params.last_name) {
      urlParams.last_name = params.last_name;
    } else {
      urlParams.last_name = undefined;
    }
    if (params.phone) {
      urlParams.phone = params.phone;
    } else {
      urlParams.phone = undefined;
    }
    if (params.code) {
      urlParams.code = params.code;
    } else {
      urlParams.code = undefined;
    }
    if (params.email) {
      urlParams.email = params.email;
    } else {
      urlParams.email = undefined;
    }
    if (params.ordering) {
      urlParams.ordering = params.ordering;
    } else {
      urlParams.ordering = undefined;
    }
    if (params.page) {
      urlParams.page = params.page;
    } else {
      urlParams.page = pagination.current;
    }
    if (params.limit) {
      urlParams.limit = params.limit;
    } else {
      urlParams.limit = pagination.pageSize;
    }
    return urlParams;
  }, [
    pagination,
    params.code,
    params.email,
    params.first_name,
    params.last_name,
    params.limit,
    params.ordering,
    params.page,
    params.phone,
    params.search,
  ]);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.hr.employee.list(
          payload.search,
          {
            first_name: payload.first_name,
            last_name: payload.last_name,
            phone: payload.phone,
            email: payload.email,
          },
          payload.ordering,
          payload.page,
          payload.limit,
        );
        setUsers(response.results);
        setResPagination(prevState => ({
          ...prevState,
          current: payload.page,
          pageSize: payload.limit,
          total: response.count,
        }));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    payload.email,
    payload.first_name,
    payload.last_name,
    payload.limit,
    payload.ordering,
    payload.page,
    payload.phone,
    payload.search,
  ]);
  return {
    loading,
    error,
    users,
    resPagination,
  };
};
