import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';
import { RootState } from 'types';

const selectSlice = (state: RootState) => state.usersmanagepage || initialState;
export const selectManageUserState = createSelector(
  [selectSlice],
  state => state,
);

export const selectParams = createSelector(
  [selectSlice],
  state => state.params,
);
