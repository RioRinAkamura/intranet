import { models } from '@hdwebsoft/boilerplate-api-sdk';

type EmployeeLeave = models.hr.EmployeeLeave;

/* --- STATE --- */
export interface LeaveApplicationState {
  results?: EmployeeLeave[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: string[];
  selectedRows?: EmployeeLeave[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
}

export interface FilterColumns {
  employee_name?: string;
  phone?: string;
  email?: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  working_type?: string;
  approval_status?: string;
  [key: string]: string | undefined;
}

export interface LeaveApplicationResponse {
  count: number;
  results: EmployeeLeave[] | [];
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  employee_name?: string;
  phone?: string;
  email?: string;
  start_date?: string;
  end_date?: string;
  working_type?: string;
  approval_status?: string;
  title?: string;
  description?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface Delete {
  IdDelete: string;
  ids?: string[];
}
