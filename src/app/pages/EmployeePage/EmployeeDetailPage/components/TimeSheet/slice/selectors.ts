import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.employeeTimesheet || initialState;

export const selectEmployeeTimesheet = createSelector(
  [selectSlice],
  state => state,
);

export const selectEmployeeTimesheetIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectEmployeeTimesheetFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);
export const selectEmployeeTimesheetSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectEmployeeTimesheetParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectEmployeeTimesheetAddSuccess = createSelector(
  [selectSlice],
  state => state.addSuccess,
);
export const selectEmployeeTimesheetAddFailed = createSelector(
  [selectSlice],
  state => state.addFailed,
);
export const selectEmployeeTimesheetEditSuccess = createSelector(
  [selectSlice],
  state => state.editSuccess,
);
export const selectEmployeeTimesheetEditFailed = createSelector(
  [selectSlice],
  state => state.editFailed,
);
export const selectEmployeeTimesheetDeleteSuccess = createSelector(
  [selectSlice],
  state => state.deleteSuccess,
);
export const selectEmployeeTimesheetDeleteFailed = createSelector(
  [selectSlice],
  state => state.deleteFailed,
);
