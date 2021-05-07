import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { Key } from 'react';

type Employee = models.hr.Employee;

/* --- STATE --- */
export interface UserspageState {
  users?: Employee[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: Key[];
  selectedRows?: Employee[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
}

export interface FilterColumns {
  [key: string]: string | undefined;
}

export interface UserResponse {
  count: number;
  results: Employee[] | [];
}

export interface QueryParams {
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
