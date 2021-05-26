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
