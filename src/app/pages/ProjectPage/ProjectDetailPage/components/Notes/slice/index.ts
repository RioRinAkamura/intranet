import { Key } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ProjectNotesFetchData,
  ProjectNotePayloadAction,
  ProjectNoteState,
  QueryParams,
  Pagination,
  FilterColumns,
} from './types';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { projectNoteSaga } from './saga';

export const initialState: ProjectNoteState = {
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
  filterColums: {},
  selectedRowKeys: [],
};

const slice = createSlice({
  name: 'projectNote',
  initialState,
  reducers: {
    fetchProjectNotes(state, action: PayloadAction<ProjectNotesFetchData>) {
      state.loading = true;
    },
    fetchProjectNotesSuccess(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
      state.notes = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchProjectNotesFailure(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    createProjectNote(state, action: PayloadAction<ProjectNotePayloadAction>) {
      state.loading = true;
    },
    createProjectNoteSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.isSuccess = true;
    },
    createProjectNoteFailure(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    updateProjectNote(state, action: PayloadAction<ProjectNotePayloadAction>) {
      state.loading = true;
    },
    updateProjectNoteSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.isSuccess = true;
    },
    updateProjectNoteFailure(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    deleteProjectNote(state, action: PayloadAction<ProjectNotePayloadAction>) {
      state.loading = true;
    },
    deleteProjectNoteSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.deleteIsSuccess = true;
    },
    deleteProjectNoteFailure(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    deleteMultipleProjectNotes(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
      state.loading = true;
    },
    deleteMultipleProjectNotesSuccess(state) {
      state.isFilter = false;
      state.loading = false;
      state.deleteIsSuccess = true;
      state.isDeleteMultiple = true;
    },
    deleteMultipleProjectNotesFailure(
      state,
      action: PayloadAction<ProjectNotePayloadAction>,
    ) {
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
      state.filterColums = {
        ...state.filterColums,
        category: action.payload.category,
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
      state.filterColums = { ...state.filterColums, ...action.payload };
      state.params = { ...state.params, ...action.payload };
    },
    selectedRows<T>(
      state,
      action: PayloadAction<{ selectedRowKeys?: Key[]; selectedRows?: T[] }>,
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
      state.filterColums = {};
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
  useInjectSaga({ key: slice.name, saga: projectNoteSaga });
  return { actions: slice.actions };
};
