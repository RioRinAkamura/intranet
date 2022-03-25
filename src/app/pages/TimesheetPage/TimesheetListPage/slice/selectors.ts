import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.projectTimesheet || initialState;

export const selectProjectTimesheetState = createSelector(
  [selectSlice],
  state => state,
);

export const selectProjectTimesheetIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectProjectTimesheetFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);
export const selectProjectTimesheetSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectProjectTimesheetParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectProjectTimesheetAddSuccess = createSelector(
  [selectSlice],
  state => state.addSuccess,
);
export const selectProjectTimesheetAddFailed = createSelector(
  [selectSlice],
  state => state.addFailed,
);
export const selectProjectTimesheetEditSuccess = createSelector(
  [selectSlice],
  state => state.editSuccess,
);
export const selectProjectTimesheetEditFailed = createSelector(
  [selectSlice],
  state => state.editFailed,
);
export const selectProjectTimesheetDeleteSuccess = createSelector(
  [selectSlice],
  state => state.deleteSuccess,
);
export const selectProjectTimesheetDeleteFailed = createSelector(
  [selectSlice],
  state => state.deleteFailed,
);
