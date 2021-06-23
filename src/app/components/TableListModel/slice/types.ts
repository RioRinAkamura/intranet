import { Key, SorterResult } from 'antd/lib/table/interface';
import { RootStateKeyType } from 'utils/types/injector-typings';

export interface useDataTable {
  setSearchText: (text: string) => void;
  resetSearch: () => void;
  setFilterText: (value: FilterColumns) => void;
  setSelectedRows: <T>(selectedRowKeys: Key[], selectedRows: T[]) => void;
  setOrdering: <T>(sorter: SorterResult<T> | SorterResult<T>[]) => void;
  setPagination: (pagination: TablePagination) => void;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface ListResponse {
  count: number;
  results: [];
}

export interface TableListState {
  model: string;
  results?: [];
  loading?: boolean;
  error?: Error;
  reload?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  selectedRowKeys?: string[];
  selectedRows?: [];
  deleteSuccess?: boolean;
  deleteFailed?: boolean;
}

export interface TableStateProps {
  loading?: boolean;
  params: QueryParams;
  filterColumns?: FilterColumns;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface FilterColumns {
  [key: string]: string | undefined;
}

export interface TableActions {
  [key: string]: Function;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface Delete {
  id: string;
  model: RootStateKeyType;
  ids?: string[];
}
