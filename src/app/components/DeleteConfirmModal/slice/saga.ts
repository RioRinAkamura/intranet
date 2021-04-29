import { call, put, takeLatest } from 'redux-saga/effects';
import { deleteModalActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';

function* deleteEmployee(
  action: PayloadAction<{
    id: string;
  }>,
) {
  try {
    yield call(() => {});
    yield put({ type: actions.deleteSuccess.type });
    yield put({ type: actions.resetModalDeleteState.type });
  } catch (error) {
    yield put({ type: actions.deleteFailed.type });
  }
}

export function* Saga() {
  yield takeLatest(actions.deleteEmployee.type, deleteEmployee);
}
