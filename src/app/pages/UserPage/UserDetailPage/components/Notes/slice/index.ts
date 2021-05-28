import { Key } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { notesSaga } from './saga';
import { NotesState, QueryParams, Pagination, FilterColumns } from './types';

export const notes = [
  {
    id: '1',
    type: 'A',
    summary: 'B',
    date: new Date(1621846284657).toISOString(),
    content: 'D',
  },
  {
    id: '2',
    type: 'F',
    summary: 'G',
    date: new Date(1621846293152).toISOString(),
    content: 'H',
  },
];

export const initialState: NotesState = {
  notes: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  isFilter: true,
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
  name: 'notesState',
  initialState,
  reducers: {
    fetchNotes(state, action: PayloadAction<NotesState>) {
      // state.loading = true;
    },
    fetchNotesSuccess(state, action: PayloadAction<NotesState>) {
      console.log(action);

      state.loading = false;
      state.notes = action.payload.notes;
    },
    fetchNotesFailure(state) {
      state.error = {
        message: 'Faulty fetch notes',
        name: 'Fetch data',
      };
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
  useInjectSaga({ key: slice.name, saga: notesSaga });
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
