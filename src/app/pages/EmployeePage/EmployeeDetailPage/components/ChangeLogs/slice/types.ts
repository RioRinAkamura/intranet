import { EmployeeChangeLog } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

/* --- STATE --- */
export interface EmployeeChangeLogsState {
  changeLogs: EmployeeChangeLog[];
  loading?: boolean;
  error?: Error;
  isSuccess?: boolean;
  params: QueryParams;
  pagination?: Pagination;
}

export interface QueryParams {
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface EmployeeChangeLogsFetchData {
  employee_id: string;
  params: QueryParams;
}

export interface EmployeeNotePayloadAction {
  results?: EmployeeChangeLog[];
  count?: number;
  error?: Error;
}
