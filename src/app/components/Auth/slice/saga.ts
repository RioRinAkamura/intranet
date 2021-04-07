import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import { authActions as actions } from '.';

function loginExample(email, password) {
  return request('https://reqres.in/api/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response: any) => {
      return {
        token: response.token,
      };
    })
    .catch(err => {
      console.log(err);
    });
}

function* login(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(loginExample, email, password);
    yield put(actions.isSignin({ authenticated: true }));
  } catch (err) {
    console.log(err);
  }

  // const data = yield user.json();
  // yield put({ type: actions.isSignin.type, payload: true });
}

export function* authSaga() {
  yield takeLatest(actions.login.type, login);
  // can be an array
  // yield [takeLatest(actions.login.type, login)];
}
