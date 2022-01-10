import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.projectNote || initialState;

export const selectProjectNotes = createSelector([selectSlice], state => state);

export const selectProjectNoteIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectProjectNotesParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectProjectNoteIsSuccess = createSelector(
  [selectSlice],
  state => state.isSuccess,
);
