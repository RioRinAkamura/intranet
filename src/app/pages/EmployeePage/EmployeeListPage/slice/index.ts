import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userspageSaga } from './saga';
import {
  EmployeePageState,
  UserResponse,
  FilterColumns,
  QueryParams,
} from './types';
import { Key } from 'react';
import { TablePagination } from '../useHandleDataTable';

export const initialState: EmployeePageState = {
  employees: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  isFilter: true,
  params: {
    limit: 20,
    page: 1,
  },
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  filterColumns: {},
  selectedRowKeys: [],
};

const slice = createSlice({
  name: 'employeespage',
  initialState,
  reducers: {
    fetchUsers(state, action: PayloadAction<EmployeePageState>) {
      state.loading = true;
    },
    fetchUsersSuccess(state, action: PayloadAction<UserResponse>) {
      state.employees = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchUsersFailure(state, action: PayloadAction<EmployeePageState>) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        code: action.payload.code,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber,
        tags: action.payload.tags,
        monitoring: action.payload.monitoring,
        from: action.payload.from,
        to: action.payload.to,
        skills: action.payload.skills,
        same_projects: action.payload.same_projects,
      };
      state.pagination = {
        ...state.pagination,
        current: action.payload.page,
        pageSize: action.payload.limit,
      };
      state.isFilter = false;
    },
    notQuery(state) {
      state.isFilter = false;
    },
    filterColumns(state, action: PayloadAction<FilterColumns>) {
      state.filterColumns = { ...state.filterColumns, ...action.payload };
      state.params = { ...state.params, ...action.payload };
    },
    selectedRows<T>(
      state,
      action: PayloadAction<{
        selectedRowKeys?: Key[];
        selectedRows?: T[];
      }>,
    ) {
      state.selectedRowKeys = action.payload.selectedRowKeys;
      state.selectedRows = action.payload.selectedRows;
    },
    setSearchText(
      state,
      action: PayloadAction<{ text: string; isDeleted: string | undefined }>,
    ) {
      state.params.search = action.payload.text;
      state.params.is_deleted = action.payload.isDeleted;
      if (state.params.page && state.params.page > 1) {
        state.params.page = 1;
      }
    },
    resetSearch(state) {
      state.filterColumns = {};
      state.params = {
        limit: 20,
        page: 1,
        ordering: '',
      };
      state.selectedRowKeys = undefined;
      state.selectedRows = undefined;
    },
    setOrdering(state, action: PayloadAction<string | undefined>) {
      state.params.ordering = action.payload;
    },
    setPagination(state, action: PayloadAction<TablePagination>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.isFilter = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteMultiUser(state, action: PayloadAction<string>) {
      state.isFilter = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteUserSuccess(state) {
      state.isFilter = false;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteUserFailure(state) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
  },
});

export const { actions: userspageActions } = slice;

export const useUserspageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userspageSaga });
  return { actions: slice.actions };
};
