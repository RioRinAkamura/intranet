import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { employeeChangeLogsSaga } from './saga';
import {
  Pagination,
  EmployeeChangeLogsState,
  EmployeeChangeLogsFetchData,
  EmployeeNotePayloadAction,
} from './types';

export const initialState: EmployeeChangeLogsState = {
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
  name: 'employeeChangeLogs',
  initialState,
  reducers: {
    fetchEmployeeChangeLogs(
      state,
      action: PayloadAction<EmployeeChangeLogsFetchData>,
    ) {
      state.loading = true;
    },
    fetchEmployeeChangeLogsSuccess(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.loading = false;
      state.isSuccess = true;
      state.changeLogs = action.payload.results || [];
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
    },
    fetchEmployeeChangeLogsFailure(
      state,
      action: PayloadAction<EmployeeNotePayloadAction>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    setPagination(state, action: PayloadAction<Pagination>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
    },
    resetPagination(state) {
      state.params.limit = 20;
      state.params.page = 1;
    },
  },
});

export const { actions: employeeChangeLogsActions } = slice;

export const useEmployeeChangeLogsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeeChangeLogsSaga });
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
