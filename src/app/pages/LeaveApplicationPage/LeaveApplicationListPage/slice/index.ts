import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { employeeLeavePageSaga } from './saga';
import { EmployeeLeaveResponse, LeaveApplicationState } from './types';

export const initialState: LeaveApplicationState = {
  employeesLeave: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  // errorCode: 0,
  selectedRowKeys: [],
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  params: {
    limit: 20,
    page: 1,
  },
  filterColumns: {},
  errorMessage: '',
};

const slice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    fetchEmployeesLeave(state, action) {
      state.loading = true;
    },
    fetchEmployeesLeaveSuccess(
      state,
      action: PayloadAction<EmployeeLeaveResponse>,
    ) {
      state.loading = false;
      state.employeesLeave = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
    },
    fetchEmployeeLeavesFailed(
      state,
      action: PayloadAction<LeaveApplicationState>,
    ) {
      state.loading = false;
    },
  },
});

export const { actions: EmployeesLeaveActions } = slice;

export const EmployeeLeavePageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeeLeavePageSaga });
  return { actions: slice.actions };
};
