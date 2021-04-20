import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { changePasswordActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';

function* changePassword(
  action: PayloadAction<{
    oldpassword: string;
    newpassword: string;
    confirmPassword: string;
  }>,
) {
  try {
    //yield call api change Password
    yield put({ type: actions.changeSuccess.type });
  } catch (err) {
    console.log(err);
    yield put({ type: actions.changeErr.type });
  } finally {
    yield put({ type: actions.resetState.type });
  }
}

export function* Saga() {
  yield takeLatest(actions.changePassword.type, changePassword);
}
