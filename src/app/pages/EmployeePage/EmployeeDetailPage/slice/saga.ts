import { put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { Actions as actions } from '.';

export function* fetchIdentity() {
  try {
    const response = yield api.hr.identity.get();
    yield put(
      actions.fetchIdentitySuccess({
        identity: response,
        error: false,
        loading: false,
      }),
    );
  } catch (error) {
    yield put(actions.fetchIdentityFailure());
  }
}

export function* userDetailsSaga() {
  yield* [takeLatest(actions.fetchIdentity.type, fetchIdentity)];
}
