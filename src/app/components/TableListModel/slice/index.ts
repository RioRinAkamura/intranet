import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { TableSaga } from './saga';
import { Key } from 'react';
import {
  Delete,
  FilterColumns,
  QueryParams,
  TableListState,
  TablePagination,
} from './types';
import { RootStateKeyType } from 'utils/types/injector-typings';

export const initialState: TableListState = {
  model: 'table',
  results: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  reload: true,
  params: {
    limit: 20,
    page: 1,
    search: '',
    ordering: '',
  },
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  filterColumns: {},
  selectedRows: [],
  selectedRowKeys: [],
};

const sliceOptions = (model: RootStateKeyType) => ({
  name: model,
  initialState,
  reducers: {
    fetchList(state, action) {
      state.loading = true;
    },
    fetchListSuccess(state, action: PayloadAction<any>) {
      state.results = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.reload = false;
    },
    fetchListFailure(state, action: PayloadAction<TableListState>) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        name: action.payload.name,
        priority: action.payload.priority,
        status: action.payload.status,
      };
      state.pagination = {
        ...state.pagination,
        current: action.payload.page,
        pageSize: action.payload.limit,
      };
      state.loading = false;
      state.reload = true;
    },
    notQuery(state) {
      state.reload = false;
    },
    filterColumns(state, action: PayloadAction<FilterColumns>) {
      state.filterColumns = { ...state.filterColumns, ...action.payload };
      state.params = { ...state.params, ...action.payload };
      state.reload = true;
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
      state.reload = true;
    },
    resetSearch(state) {
      state.filterColumns = {};
      state.params = {
        limit: 20,
        page: 1,
        search: '',
        ordering: '',
      };
      state.selectedRowKeys = undefined;
      state.selectedRows = undefined;
      state.reload = true;
    },
    setOrdering(state, action: PayloadAction<string | undefined>) {
      state.params.ordering = action.payload;
      state.reload = true;
    },
    setPagination(state, action: PayloadAction<TablePagination>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
      state.reload = true;
    },
    delete(state, action: PayloadAction<Delete>) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteSuccess(state) {
      state.reload = true;
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
  },
});

export const tableActions = (model: RootStateKeyType) => {
  return createSlice(sliceOptions(model)).actions;
};

export const useTableSlice = (model: RootStateKeyType) => {
  sessionStorage.setItem('model', model);
  const slice = createSlice(sliceOptions(model));
  useInjectReducer({ key: model, reducer: slice.reducer });
  useInjectSaga({ key: model, saga: TableSaga });
  return { actions: slice.actions };
};
