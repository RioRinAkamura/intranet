import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.userspage || initialState;

export const selectUserspage = createSelector([selectSlice], state => state);
