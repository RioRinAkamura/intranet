import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.projectChangeLogs || initialState;

export const selectProjectChangeLogs = createSelector(
  [selectSlice],
  state => state,
);

export const selectProjectChangeLogsIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectProjectChangeLogsParams = createSelector(
  [selectSlice],
  state => state.params,
);
