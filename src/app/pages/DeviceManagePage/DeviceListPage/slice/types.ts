export interface Device {
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

export interface DevicesManagerState {
  results?: Device[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: string[];
  selectedRows?: Device[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
  identity?: string;
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

export interface IdentityPayload {
  identity?: string;
  loading: boolean;
  error?: Error;
}
