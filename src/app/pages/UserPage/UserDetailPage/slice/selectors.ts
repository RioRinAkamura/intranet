import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.userDetails || initialState;

export const selectUserDetails = createSelector([selectSlice], state => state);
