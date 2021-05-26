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
}

export interface FilterColumns {
  project__name?: string;
  [key: string]: string | undefined;
}

export interface UserResponse {
  count: number;
  results: any[] | [];
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
