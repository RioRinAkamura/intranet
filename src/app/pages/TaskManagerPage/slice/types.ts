export interface Task {
  employee: string;
  category: string;
  created?: string;
  modified?: string;
  code: string;
  since: number;
  description: string;
  health_status: string;
  status: string;
}

export interface TaskManagerState {
  results?: any;
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: string[];
  selectedRows?: Task[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
}

export interface FilterColumns {
  status?: string;
  health_status?: string;
  code?: string;
  category?: string;
  since?: string;
  employee?: string;
  [key: string]: string | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface Delete {
  IdDelete: string;
  ids?: string[];
}
