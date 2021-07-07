import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.employeeDetails || initialState;

export const selectUserDetails = createSelector([selectSlice], state => state);
