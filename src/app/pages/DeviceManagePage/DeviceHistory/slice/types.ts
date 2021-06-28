export interface DeviceHistory {
  employee: string;
  user: string;
  note: string;
}

export interface DeviceHistoryState {
  results?: DeviceHistory[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: string[];
  selectedRows?: DeviceHistory[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
}

export interface FilterColumns {
  // employee_name?: string;
  // phone?: string;
  // email?: string;
  // title?: string;
  // description?: string;
  // start_date?: string;
  // end_date?: string;
  // working_type?: string;
  // approval_status?: string;
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
