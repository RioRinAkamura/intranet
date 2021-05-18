import { Key } from 'react';

/* --- STATE --- */
export interface ProjectsState {
  projects?: any;
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: Key[];
  selectedRows?: any;
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
}

export interface FilterColumns {
  [key: string]: string | undefined;
}

export interface UserResponse {
  count: number;
  results: any;
}

export interface QueryParams {
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
