import { PayloadAction } from '@reduxjs/toolkit';
import { TablePagination } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import { Key } from 'react';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { projectsSaga } from './saga';
import { FilterColumns, ProjectsState, QueryParams } from './types';

export const initialState: ProjectsState = {
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
  name: 'projects',
  initialState,
  reducers: {
    fetchProjects(state, action: PayloadAction<ProjectsState>) {
      state.loading = true;
    },
    fetchProjectsSuccess(state, action: PayloadAction<any>) {
      state.projects = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchProjectsFailure(state, action: PayloadAction<ProjectsState>) {
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
    deleteUser(state, action: PayloadAction<string>) {
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

export const { actions: projectsActions } = slice;

export const useProjectsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: projectsSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useProjectsSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
