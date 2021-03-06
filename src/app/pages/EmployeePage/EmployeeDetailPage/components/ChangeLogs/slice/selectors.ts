import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.employeeChangeLogs || initialState;

export const selectEmployeeChangeLogs = createSelector(
  [selectSlice],
  state => state,
);

export const selectEmployeeChangeLogsIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectEmployeeChangeLogsParams = createSelector(
  [selectSlice],
  state => state.params,
);
