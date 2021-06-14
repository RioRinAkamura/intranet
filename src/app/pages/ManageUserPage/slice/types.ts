import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { Key } from 'react';

type User = models.user.User;

export interface UsersManagePageState {
  users?: User[] | [];
  loading?: boolean;
  selectedRowKeys?: Key[];
  pagination?: Pagination;
  params: QueryParams;
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
  filterColumns?: object;
  selectedRows?: User[];
}

export interface UserManageResponse {
  count: number;
  results: User[] | [];
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface QueryParams {
  search?: string;
  first_name?: string;
  last_name?: string;
  code?: string;
  email?: string;
  phoneNumber?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
