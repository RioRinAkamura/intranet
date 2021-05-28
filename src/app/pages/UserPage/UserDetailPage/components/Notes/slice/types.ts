import { Key } from 'react';

/* --- STATE --- */
export interface Note {
  id: string;
  type: string;
  summary: string;
  date: string;
  content: string;
}

export interface NotesState {
  notes?: Note[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: Key[];
  selectedRows?: Note[];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
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
