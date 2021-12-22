import { models } from "@hdwebsoft/intranet-api-sdk";
import { Key } from 'react';

type EmployeeLeave = models.hr.EmployeeLeave;

export interface LeaveApplicationState {
  employeesLeave?: EmployeeLeave[] | [];
  loading?: boolean;
  selectedRowKeys?: Key[];
  pagination?: Pagination;
  params: QueryParams;
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
  filterColumns?: object;
  selectedRows?: EmployeeLeave[];
  errorMessage?: string;
}

export interface EmployeeLeaveResponse {
  count: number;
  results: EmployeeLeave[] | [];
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