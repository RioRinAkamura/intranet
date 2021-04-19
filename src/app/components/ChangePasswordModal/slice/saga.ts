import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { changePasswordActions as actions } from '.';

function* ChangePw(action) {
  try {
    //yield call api change Password
    yield delay(1000);
    let status = 200;
    if (status === 200) {
      yield put({ type: actions.changeSuccess.type });
    } else {
      yield put({ type: actions.changeErr.type });
    }
    yield put({ type: actions.resetState.type });
  } catch (err) {
    console.log(err);
  }
}

export function* Saga() {
  yield takeLatest(actions.changePassword.type, ChangePw);
}
