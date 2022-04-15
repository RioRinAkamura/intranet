import { PayloadAction } from '@reduxjs/toolkit';
import { TablePagination } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { Key } from 'react';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { employeeTimesheetSaga } from './saga';
import {
  DeleteEmployeeTimesheetParams,
  EmployeeTimesheet,
  EmployeeTimesheetState,
  FilterColumns,
  QueryParams,
} from './types';

export const initialState: EmployeeTimesheetState = {
  id: '',
  results: [],
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
  name: 'employeeTimesheet',
  initialState,
  reducers: {
    fetchEmployeeTimesheet(
      state,
      action: PayloadAction<EmployeeTimesheetState>,
    ) {
      state.loading = true;
    },
    fetchEmployeeTimesheetSuccess(state, action: PayloadAction<any>) {
      state.results = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchEmployeeTimesheetFailure(
      state,
      action: PayloadAction<EmployeeTimesheetState>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        work_status: action.payload.work_status,
        date: action.payload.date,
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
    addTimesheet(state, action: PayloadAction<EmployeeTimesheet>) {
      state.isFilter = true;
      state.addSuccess = false;
      state.addFailed = false;
    },
    addTimesheetSuccess(state) {
      state.isFilter = false;
      state.addSuccess = true;
      state.addFailed = false;
    },
    addTimesheetFailure(state) {
      state.addSuccess = false;
      state.addFailed = true;
    },
    resetStateAddModal(state) {
      state.addSuccess = false;
      state.addFailed = false;
    },
    editTimesheet(state, action: PayloadAction<EmployeeTimesheet>) {
      state.isFilter = true;
      state.editSuccess = false;
      state.editFailed = false;
    },
    editTimesheetSuccess(state) {
      state.isFilter = false;
      state.editSuccess = true;
      state.editFailed = false;
    },
    editTimesheetFailure(state) {
      state.editSuccess = false;
      state.editFailed = true;
    },
    resetStateEditModal(state) {
      state.editSuccess = false;
      state.editFailed = false;
    },
    deleteTimesheet(
      state,
      action: PayloadAction<DeleteEmployeeTimesheetParams>,
    ) {
      state.isFilter = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteTimesheetSuccess(state) {
      state.isFilter = false;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteTimesheetFailure(state) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
  },
});

export const { actions: employeeTimesheetActions } = slice;

export const useEmployeeTimesheetSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeeTimesheetSaga });
  return { actions: slice.actions };
};
