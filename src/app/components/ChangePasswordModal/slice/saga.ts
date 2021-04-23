import { call, put, takeLatest } from 'redux-saga/effects';
import { changePasswordActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from 'utils/api';

function* changePassword(
  action: PayloadAction<{
    oldpassword: string;
    newpassword: string;
    confirmPassword: string;
  }>,
) {
  try {
    //yield call api change Password
    const { oldpassword, newpassword } = action.payload;
    yield call(() => api.auth.changePassword(oldpassword, newpassword));
    yield put({ type: actions.changeSuccess.type });

    yield put({ type: actions.resetState.type });
  } catch (err) {
    yield put({ type: actions.changeErr.type });
  } finally {
  }
}

export function* Saga() {
  yield takeLatest(actions.changePassword.type, changePassword);
}
