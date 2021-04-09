import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import { api } from 'utils/sessionConfig';
import { authActions as actions } from '.';

function* login(action) {
  try {
    const { email, password } = action.payload;
    yield call(() => {
      return api.auth.login(email, password);
    });
    yield put(actions.isSignin({ authenticated: true }));
  } catch (err) {
    console.log(err);
  }
}

function* loginAsGoogle(action) {
  try {
    console.log(action);
    yield call(() => api.auth.googleLogin({ ...action }));
  } catch (err) {
    console.log(err);
  }
}

export function* authSaga() {
  yield takeLatest(actions.login.type, login);
  yield takeLatest(actions.loginWithGoogle.type, loginAsGoogle);
  // can be an array
  // yield [takeLatest(actions.login.type, login)];
}
