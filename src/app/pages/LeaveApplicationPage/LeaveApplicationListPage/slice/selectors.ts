import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';
import { RootState } from 'types';

const selectSlice = (state: RootState) => state.leave || initialState;
export const selectEmployeeLeaveState = createSelector(
  [selectSlice],
  state => state,
);

export const selectEmployeeLeaveFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);

export const selectEmployeeLeaveParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectEmployeeLeaveSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectEmployeeLeaveDeleteSuccess = createSelector(
  [selectSlice],
  state => state.deleteSuccess,
);
export const selectEmployeeLeaveDeleteFailed = createSelector(
  [selectSlice],
  state => state.deleteFailed,
);
