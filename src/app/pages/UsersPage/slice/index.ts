import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userspageSaga } from './saga';
import { UserspageState } from './types';

export const initialState: UserspageState = {};

const slice = createSlice({
  name: 'userspage',
  initialState,
  reducers: {
    createUser(state, action: PayloadAction<any>) {},
  },
});

export const { actions: userspageActions } = slice;

export const useUserspageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userspageSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useUserspageSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
