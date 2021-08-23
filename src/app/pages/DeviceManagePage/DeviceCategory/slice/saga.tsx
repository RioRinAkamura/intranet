import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from 'utils/api';
import { categoryManageAction as actions } from '.';

function fetchCategory() {
  return api.hr.deviceCategory.list();
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
