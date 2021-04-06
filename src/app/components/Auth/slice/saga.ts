import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { authActions as actions } from '.';

function* login(action) {
  // const { email, password } = action.payload;
  // try {

  // } catch (error) {

  // }
  return new Promise((resolve, reject) => {
    const { email, password } = action.payload;
    if (email == 'hoaiphat0206@gmail.com' && password == '123123123') {
      const user = {
        email,
        userId: '123qwe123',
        token: '123asd123',
      };
      resolve(user);
    } else {
      reject({
        msg: 'Invalid user',
      });
    }
  });
  yield put({ type: actions.isSignin.type, payload: true });
}

export function* authSaga() {
  yield takeLatest(actions.login.type, login);
  // can be an array
  // yield [takeLatest(actions.login.type, login)];
}
