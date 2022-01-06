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
  identity?: string;
}

export interface FilterColumns {
  name?: string;
  priority?: string;
  status?: string;
  monitoring?: string;
  [key: string]: string | undefined;
}

export interface UserResponse {
  count: number;
  results: any;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  name?: string;
  priority?: string;
  status?: string;
  monitoring?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface IdentityPayload {
  identity?: string;
  loading: boolean;
  error?: Error;
}
