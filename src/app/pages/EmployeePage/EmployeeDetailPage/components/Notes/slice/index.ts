import { Key } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { employeeNoteSaga } from './saga';
import {
  EmployeeNotesFetchData,
  EmployeeNotePayloadAction,
  EmployeeNoteState,
  QueryParams,
  Pagination,
  FilterColumns,
} from './types';

export const initialState: EmployeeNoteState = {
  notes: [],
  loading: false,
  isFilter: true,
  isSuccess: false,
  params: {
    limit: 5,
    page: 1,
  },
  pagination: {
    pageSize: 5,
    current: 1,
    total: 5,
  },
  filterColumns: {},
  selectedRowKeys: [],
};

const slice = createSlice({
  name: 'employeeNote',
  initialState,
  reducers: {
    fetchEmployeeNotes(state, action: PayloadAction<EmployeeNotesFetchData>) {
      state.loading = true;
    },
    fetchEmployeeNotesSuccess(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.notes = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchEmployeeNotesFailure(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    createEmployeeNote(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.loading = true;
    },
    createEmployeeNoteSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.isSuccess = true;
    },
    createEmployeeNoteFailure(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    updateEmployeeNote(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.loading = true;
    },
    updateEmployeeNoteSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.isSuccess = true;
    },
    updateEmployeeNoteFailure(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    deleteEmployeeNote(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.loading = true;
    },
    deleteEmployeeNoteSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.deleteIsSuccess = true;
    },
    deleteEmployeeNoteFailure(state) {
      state.deleteIsFailure = true;
      state.loading = false;
    },
    deleteMultipleEmployeeNotes(state, action: PayloadAction<string[]>) {
      state.loading = true;
    },
    deleteMultipleEmployeeNotesSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.deleteIsSuccess = true;
      state.isDeleteMultiple = true;
    },
    deleteMultipleEmployeeNotesFailure(state) {
      state.deleteIsFailure = true;
      state.loading = false;
    },
    resetState(state) {
      state.isSuccess = false;
      state.deleteIsFailure = false;
      state.deleteIsSuccess = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        type: action.payload.type,
        summary: action.payload.summary,
        date: action.payload.date,
        content: action.payload.content,
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
    setPagination(state, action: PayloadAction<Pagination>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
    },
  },
});

export const { actions: Actions } = slice;

export const useNotesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeeNoteSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
