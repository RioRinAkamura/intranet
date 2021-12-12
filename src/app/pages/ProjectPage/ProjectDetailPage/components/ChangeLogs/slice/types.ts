import { ChangeLog } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

/* --- STATE --- */
export interface ProjectChangeLogsState {
  changeLogs: ChangeLog[];
  loading?: boolean;
  isFilter?: boolean;
  filterColumns?: FilterColumns;
  error?: Error;
  isSuccess?: boolean;
  params: QueryParams;
  pagination?: Pagination;
}

export interface QueryParams {
  ordering?: string;
  limit?: number;
  page?: number;
  change_date?: string;
  [key: string]: string | number | undefined;
}

export interface FilterColumns {
  change_date?: string;
  [key: string]: string | undefined;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface ProjectChangeLogsFetchData {
  project_id: string;
  params: QueryParams;
}

export interface ProjectChangeLogsPayloadAction {
  results?: ChangeLog[];
  count?: number;
  error?: Error;
}
