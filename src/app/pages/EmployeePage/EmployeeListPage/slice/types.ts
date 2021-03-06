import { models } from '@hdwebsoft/intranet-api-sdk';
import { Key } from 'react';

type Employee = models.hr.Employee;

/* --- STATE --- */
export interface EmployeePageState {
  employees?: Employee[] | [];
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

export interface UserResponse {
  count: number;
  results: Employee[] | [];
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  first_name?: string;
  last_name?: string;
  code?: string;
  email?: string;
  phoneNumber?: string;
  tags?: string;
  monitoring?: string;
  from?: string;
  to?: string;
  exact?: string;
  limit?: number;
  page?: number;
  skills?: string;
  same_projects?: string;
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
