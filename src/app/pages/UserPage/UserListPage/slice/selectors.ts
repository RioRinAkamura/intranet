import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.userspage || initialState;

export const selectUserspage = createSelector([selectSlice], state => state);

export const selectUserspageIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectUserspageFilterColumns = createSelector(
  [selectSlice],
  state => state.filterFolumns,
);
export const selectUserspageSearchText = createSelector(
  [selectSlice],
  state => state.searchText,
);

export const selectUserspageParams = createSelector(
  [selectSlice],
  state => state.params,
);
