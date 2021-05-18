import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.projects || initialState;

export const selectProjects = createSelector([selectSlice], state => state);

export const selectProjectsIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectProjectsFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);
export const selectProjectsSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectProjectsParams = createSelector(
  [selectSlice],
  state => state.params,
);
