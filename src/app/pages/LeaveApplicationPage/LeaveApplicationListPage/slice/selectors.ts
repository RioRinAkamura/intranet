import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.leaveApplication || initialState;

export const selectState = createSelector([selectSlice], state => state);

export const selectIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);

export const selectSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectParams = createSelector(
  [selectSlice],
  state => state.params,
);
