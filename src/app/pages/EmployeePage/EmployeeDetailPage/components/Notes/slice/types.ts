import { Key } from 'react';

/* --- STATE --- */
export interface EmployeeNote {
  id: string;
  category: string;
  summary: string;
  date: string;
  content: string;
}

export interface EmployeeNotesFetchData {
  employee_id: string;
  params: QueryParams;
}
export interface EmployeeNotePayloadAction {
  note_id?: string;
  employee_id?: string;
  results?: EmployeeNote[];
  count?: number;
  error?: Error;
}

export interface EmployeeNoteState {
  notes?: EmployeeNote[] | [];
  loading?: boolean;
  error?: Error;
  isSuccess?: boolean;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: Key[];
  selectedRows?: EmployeeNote[];
  deleteIsSuccess?: boolean;
  deleteIsFailure?: boolean;
  isDeleteMultiple?: boolean;
}

export interface FilterColumns {
  type?: string;
  summary?: string;
  date?: string;
  content?: string;
  [key: string]: string | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  type?: string;
  summary?: string;
  date?: string;
  content?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
