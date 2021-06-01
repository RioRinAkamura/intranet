import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.employeeNote || initialState;

export const selectEmployeeNotes = createSelector(
  [selectSlice],
  state => state,
);

export const selectEmployeeNoteIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectEmployeeNotesParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectEmployeeNoteIsSuccess = createSelector(
  [selectSlice],
  state => state.isSuccess,
);
