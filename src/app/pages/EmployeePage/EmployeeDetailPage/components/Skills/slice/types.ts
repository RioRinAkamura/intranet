import { Key } from 'react';

/* --- STATE --- */
export interface EmployeeSkillState {
  id: string;
  skills?: any[] | [];
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
  skill__name?: string;
  [key: string]: string | undefined;
}

export interface QueryParams {
  search?: string;
  ordering?: string;
  skill__name?: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface EmployeeSkill {
  employeeId: string;
  data: {
    skillId: string;
  };
}
export interface DeleteEmployeeSkillParam {
  employeeId: string;
  skillId: string;
}
