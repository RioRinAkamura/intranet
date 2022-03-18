import { EmployeeTimesheetQueryParams } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Key } from 'react';

export interface EmployeeTimesheetState {
  id: string;
  timesheet: EmployeeTimesheet[];
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
  timesheet__name?: string;
  [key: string]: string | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  timesheet__name?: string;
  limit?: number;
  page?: number;
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
