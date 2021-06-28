import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.CategoryManager || initialState;

export const selectCategories = createSelector(
  [selectSlice],
  state => state.results,
);

export const selectState = createSelector([selectSlice], state => state);
