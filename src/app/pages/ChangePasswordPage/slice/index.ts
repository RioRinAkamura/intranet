import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Saga } from './saga';
import { State } from './types';

export const initialState: State = {};

const slice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    changePassword(state, action: PayloadAction<{ oldPassword: string; newPassword: string }>) {},
  },
});

export const { actions: changePasswordActions } = slice;

export const useChangePasswordSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: Saga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
