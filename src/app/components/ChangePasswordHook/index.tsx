import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { State } from '../ChangePasswordModal/slice/types';
import { useChangePasswordSlice } from '../ChangePasswordModal/slice';

export interface ChangePasswordPayload {
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
}

interface ChangePasswordHook {
  changePasswordState: State | undefined;
  showModalChangePassword: () => void;
  changePassword: (values: ChangePasswordPayload) => void;
  resetStateChangePassword: () => void;
}

export const useChangePassword = (): ChangePasswordHook => {
  const { actions } = useChangePasswordSlice();
  const dispatch = useDispatch();

  const changePasswordState = useSelector(
    (state: RootState) => state.changePassword,
  );

  const showModalChangePassword = () => {
    dispatch(actions.showModalChangePassword());
  };

  const changePassword = (values: ChangePasswordPayload) => {
    dispatch(actions.changePassword(values));
  };

  const resetStateChangePassword = () => {
    dispatch(actions.resetState());
  };
  return {
    changePasswordState,
    showModalChangePassword,
    changePassword,
    resetStateChangePassword,
  };
};
