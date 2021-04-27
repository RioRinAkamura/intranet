import { models } from '@hdwebsoft/boilerplate-api-sdk';

type Employee = models.hr.Employee;

/* --- STATE --- */
export interface UserspageState {
  users?: Employee[] | [];
  loading?: boolean;
  error?: Error;
  isFilter?: boolean;
  params: QueryParams;
  pagination?: Pagination;
  filterColumns?: FilterColumns;
  searchText?: string;
}

export interface FilterColumns {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  code?: string;
}

export interface UserResponse {
  count: number;
  results: Employee[] | [];
}

export interface QueryParams {
  search?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  code?: string;
  ordering?: string;
  page?: number;
  limit?: number;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}
