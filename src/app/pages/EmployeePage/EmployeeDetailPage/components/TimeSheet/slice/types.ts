import { EmployeeTimesheetQueryParams } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Key } from 'react';
import { string } from 'yup';

export interface EmployeeTimesheetState {
  id?: string;
  results?: any;
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
  work_status?: string;
  [key: string]: string | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  limit?: number;
  page?: number;
  work_status?: string;
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface EmployeeTimesheet {
  employeeId: string;
  id: string;
  data: EmployeeTimesheetQueryParams;
}
export interface DeleteEmployeeTimesheetParams {
  employeeId: string;
  timesheetId: string;
}
