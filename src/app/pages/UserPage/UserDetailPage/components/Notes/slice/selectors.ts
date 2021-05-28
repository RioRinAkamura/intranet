import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.notesState || initialState;

export const selectNotes = createSelector([selectSlice], state => state);

export const selectNotesParams = createSelector(
  [selectSlice],
  state => state.params,
);
