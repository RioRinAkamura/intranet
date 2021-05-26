import { PayloadAction } from '@reduxjs/toolkit';
import { TablePagination } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import { Key } from 'react';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { employeeProjectSaga } from './saga';
import { EmployeeProjectState, FilterColumns, QueryParams } from './types';

export const initialState: EmployeeProjectState = {
  id: '',
  projects: [],
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
  name: 'employeeProject',
  initialState,
  reducers: {
    fetchEmployeeProject(state, action: PayloadAction<EmployeeProjectState>) {
      state.loading = true;
    },
    fetchEmployeeProjectSuccess(state, action: PayloadAction<any>) {
      state.projects = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchEmployeeProjectFailure(
      state,
      action: PayloadAction<EmployeeProjectState>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        project__name: action.payload.project__name,
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
    setSearchText(state, action: PayloadAction<{ text: string }>) {
      state.params.search = action.payload.text;
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
    deleteProject(state, action: PayloadAction<string>) {
      state.isFilter = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteProjectSuccess(state) {
      state.isFilter = false;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteProjectFailure(state) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
  },
});

export const { actions: employeeProjectActions } = slice;

export const useEmployeeProjectSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeeProjectSaga });
  return { actions: slice.actions };
};
