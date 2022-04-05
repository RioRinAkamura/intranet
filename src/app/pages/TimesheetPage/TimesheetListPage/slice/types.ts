
export interface ProjectTimesheet {
  date: string;
  today_hour_total?: number;
  tomorrow_hour_total?: number;
  creators?: string;
  approved?: string;
  work_status?: string;
}

export interface ProjectTimesheetState {
  timesheet: ProjectTimesheet[];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: string[];
  selectedRows?: any[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
  addSuccess?: boolean;
  addFailed?: boolean;
  editSuccess?: boolean;
  editFailed?: boolean;
}

export interface FilterColumns {
  work_status?: string | string[];
  [key: string]: string | string[] | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  page?: number;
  limit?: number;
  work_status?: string | string[];
  [key: string]: string | number | string[] | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface DeleteProjectTimesheetParams {
  projectId: string;
  timesheetId: string;
}
