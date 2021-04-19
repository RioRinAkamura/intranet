import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Saga } from './saga';
import { State } from './types';

export const initialState: State = {
  isLoading: false,
  changePasswordSuccess: false,
  changePasswordFailed: false,
  isModalVisible: false,
};

const slice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    changePassword(
      state,
      action: PayloadAction<{ oldPassword: string; newPassword: string }>,
    ) {
      state.isLoading = true;
      state.changePasswordSuccess = false;
      state.changePasswordFailed = false;
    },
    showModalChangePassword(state) {
      state.isLoading = false;
      state.changePasswordSuccess = false;
      state.changePasswordFailed = false;
      state.isModalVisible = true;
    },
    changeSuccess(state) {
      state.isLoading = false;
      state.changePasswordSuccess = true;
      state.changePasswordFailed = false;
      state.isModalVisible = false;
    },
    changeErr(state) {
      state.isLoading = false;
      state.changePasswordSuccess = false;
      state.changePasswordFailed = true;
      state.isModalVisible = false;
    },
    resetState(state) {
      state.isLoading = false;
      state.changePasswordSuccess = false;
      state.changePasswordFailed = false;
      state.isModalVisible = false;
    },
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
