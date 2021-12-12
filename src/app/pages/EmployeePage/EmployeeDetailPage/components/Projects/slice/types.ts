import { EmployeeProjectParams } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Key } from 'react';

/* --- STATE --- */
export interface EmployeeProjectState {
  id: string;
  projects?: any[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: Key[];
  selectedRows?: any[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
  addSuccess?: boolean;
  addFailed?: boolean;
  editSuccess?: boolean;
  editFailed?: boolean;
}

export interface FilterColumns {
  project__name?: string;
  [key: string]: string | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  project__name?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface EmployeeProject {
  employeeId: string;
  data: EmployeeProjectParams;
}
