import { slice } from 'lodash';
import { takeLatest, call, put } from 'redux-saga/effects';
import fakeAPI from 'utils/fakeAPI';
import { deviceHistoryAction as actions } from '.';

function fetchDevicesHistoryAction(options) {
  return fakeAPI.get('/device-management/device-histories', {
    params: {
      page: options.params.page,
      limit: options.params.limit,
      search: options.params.search,
    },
  });
}

function* fetchListDevice(action) {
  const { params } = action.payload;
  try {
    const response = yield call(fetchDevicesHistoryAction, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });
    yield put(actions.fetchListSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchListFailure(e));
  }
}

export function* deviceManagerPageSaga() {
  yield* [takeLatest(actions.fetchList.type, fetchListDevice)];
}
