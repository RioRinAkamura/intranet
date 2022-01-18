import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Key } from 'react';
import { taskManagerPageSaga } from './saga';
import { TablePagination } from '../useHandleDataTable';

import { TaskManagerState, FilterColumns, Delete } from './types';

export const initialState: TaskManagerState = {
  results: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  isFilter: true,
  params: {
    limit: 20,
    page: 1,
    status: ['Open', 'Going'],
  },
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  filterColumns: {
    status: ['Open', 'Going'],
  },
  selectedRowKeys: [],
};

const slice = createSlice({
  name: 'TaskManager',
  initialState,
  reducers: {
    fetchList(state, action: PayloadAction<TaskManagerState>) {
      state.loading = true;
    },

    resetSearch(state) {
      state.filterColumns = {
        status: ['Open', 'Going'],
      };
      state.params = {
        limit: 20,
        page: 1,
        ordering: '',
        status: ['Open', 'Going'],
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
    fetchListSuccess(state, action) {
      state.results = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },

    changeState(state, action) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        status: action.payload.status,
        health_status: action.payload.health_status,
        code: action.payload.code,
        category: action.payload.category,
        since: action.payload.since,
        employee: action.payload.employee,
      };
      state.pagination = {
        ...state.pagination,
        current: action.payload.page,
        pageSize: action.payload.limit,
      };
      state.isFilter = false;
    },

    filterColumns(state, action: PayloadAction<FilterColumns>) {
      console.log(action.payload);
      state.filterColumns = { ...state.filterColumns, ...action.payload };
      state.params = { ...state.params, ...action.payload };
    },

    setSearchText(state, action: PayloadAction<{ text: string }>) {
      state.params.search = action.payload.text;
      if (state.params.page && state.params.page > 1) {
        state.params.page = 1;
      }
    },
    notQuery(state) {
      state.isFilter = false;
    },
    fetchListFailure(state, action) {
      state.error = action.payload.error;
      state.loading = false;
    },
    delete(state, action: PayloadAction<Delete>) {
      state.isFilter = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteSuccess(state) {
      state.isFilter = false;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteFailure(state) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
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
  },
});

export const { actions: taskManagerAction } = slice;

export const useTaskManagerPage = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });

  useInjectSaga({ key: slice.name, saga: taskManagerPageSaga });
  return { actions: slice.actions };
};
