import { takeLatest, call, put } from 'redux-saga/effects';
import fakeAPI from 'utils/fakeAPI';
import { categoryManageAction as actions } from '.';

function fetchCategory() {
  return fakeAPI.get('/hr/devices-categories');
}

function* fetchList(action) {
  try {
    const response = yield call(fetchCategory);
    yield put(actions.fetchListSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchListFailure(e));
  }
}

export function* categoriesManagerSaga() {
  yield* [takeLatest(actions.fetchList.type, fetchList)];
}
