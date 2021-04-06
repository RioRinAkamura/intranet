// import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga/effects';
import { authActions as actions } from '.';

function* login() {}

export function* authSaga() {
  yield takeLatest(actions.login.type, login);
  // can be an array
  // yield [takeLatest(actions.login.type, login)];
}
