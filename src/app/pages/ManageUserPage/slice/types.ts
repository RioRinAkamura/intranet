import { models } from '@hdwebsoft/intranet-api-sdk';
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
  filterColumns?: FilterColumns;
  selectedRows?: User[];
  errorMessage?: string;
  isFilter?: boolean;
}

export interface FilterColumns {
  first_name?: string;
  last_name?: string;
  code?: string;
  allocable?: string;
  email?: string;
  phoneNumber?: string;
  monitoring?: string;
  tags?: string;
  skills?: string;
  from?: string;
  to?: string;
  exact?: string;
  same_projects?: string;
  [key: string]: string | undefined;
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
  is_active?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
