import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.DeviceManager || initialState;

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

export const selectState = createSelector([selectSlice], state => state);
