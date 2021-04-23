import { EmployeeQueryParams } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

export enum Gender {
  'Male' = 'Male',
  'Female' = 'Female',
  '' = '',
}

export enum Status {
  'Single' = 'Single',
  'Married' = 'Married',
}

export enum Type {
  'Full-time' = 'Full-time',
  'Part-time' = 'Part-time',
  'Probation' = 'Probation',
  'Etc' = 'Etc',
}

export interface BankAccounts {
  bank_name: string;
  number: string;
  branch: string;
}

export interface ParamsPayload {
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

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
  pageSizeOptions?: string[];
  showSizeChanger?: boolean;
}

export interface Filters {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  code?: string | null;
}

export interface TagType {
  id: number;
  name: string;
  slug: string;
}
