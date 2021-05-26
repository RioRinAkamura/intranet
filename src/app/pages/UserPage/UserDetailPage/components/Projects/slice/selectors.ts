import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.employeeProject || initialState;

export const selectEmployeeProject = createSelector(
  [selectSlice],
  state => state,
);

export const selectEmployeeProjectIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectEmployeeProjectFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);
export const selectEmployeeProjectSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectEmployeeProjectParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectEmployeeProjectAddSuccess = createSelector(
  [selectSlice],
  state => state.addSuccess,
);
export const selectEmployeeProjectAddFailed = createSelector(
  [selectSlice],
  state => state.addFailed,
);
export const selectEmployeeProjectEditSuccess = createSelector(
  [selectSlice],
  state => state.editSuccess,
);
export const selectEmployeeProjectEditFailed = createSelector(
  [selectSlice],
  state => state.editFailed,
);
export const selectEmployeeProjectDeleteSuccess = createSelector(
  [selectSlice],
  state => state.deleteSuccess,
);
export const selectEmployeeProjectDeleteFailed = createSelector(
  [selectSlice],
  state => state.deleteFailed,
);
