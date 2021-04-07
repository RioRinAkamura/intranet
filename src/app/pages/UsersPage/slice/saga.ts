import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { userspageActions as actions } from '.';

function* createUser() {}

export function* userspageSaga() {
  yield takeLatest(actions.createUser.type, createUser);
}
