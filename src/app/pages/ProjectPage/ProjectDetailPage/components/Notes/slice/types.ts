import {Key} from 'react';
import {ProjectNote} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

export interface ProjectNotesFetchData {
  projectId: string;
  params: QueryParams
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  category?: string;
  summary?: string;
  date?: string;
  content?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface ProjectNotePayloadAction {
  id?: string;
  project_id?: string;
  results?: ProjectNote[];
  count?: number;
  error?: Error;
  noteIds?: string[];
}

export interface ProjectNoteState {
  notes?: ProjectNote[] | [];
  loading?: boolean;
  error?: Error;
  isSuccess?: boolean;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColums?: FilterColumns;
  selectedRowKeys?: Key[];
  selectedRows?: ProjectNote[];
  deleteIsSuccess?: boolean;
  deleteIsFailure?: boolean;
  isDeleteMultiple?: boolean;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface FilterColumns {
  type?: string;
  summary?: string;
  date?: string;
  content?: string;
  [key: string]: string | undefined;
}
