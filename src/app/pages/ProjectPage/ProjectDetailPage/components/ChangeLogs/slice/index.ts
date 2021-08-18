import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { projectChangeLogsSaga } from './saga';
import {
  QueryParams,
  FilterColumns,
  ProjectChangeLogsState,
  ProjectChangeLogsFetchData,
  ProjectChangeLogsPayloadAction,
} from './types';

export const initialState: ProjectChangeLogsState = {
  changeLogs: [],
  loading: false,
  isSuccess: false,
  params: {
    limit: 20,
    page: 1,
  },
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
};

const slice = createSlice({
  name: 'projectChangeLogs',
  initialState,
  reducers: {
    fetchProjectChangeLogs(
      state,
      action: PayloadAction<ProjectChangeLogsFetchData>,
    ) {
      state.loading = true;
    },
    fetchProjectChangeLogsSuccess(
      state,
      action: PayloadAction<ProjectChangeLogsPayloadAction>,
    ) {
      state.loading = false;
      state.isSuccess = true;
      state.isFilter = true;
      state.changeLogs = action.payload.results || [];
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
    },
    fetchProjectChangeLogsFailure(
      state,
      action: PayloadAction<ProjectChangeLogsPayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        change_date: action.payload.change_date,
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
    },
    setOrdering(state, action: PayloadAction<string | undefined>) {
      state.params.ordering = action.payload;
    },
    setPagination(state, action: PayloadAction<any>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
    },
  },
});

export const { actions: projectChangeLogsActions } = slice;

export const useProjectChangeLogsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: projectChangeLogsSaga });
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
