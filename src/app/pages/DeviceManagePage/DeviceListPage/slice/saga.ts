import { takeLatest, call, put } from 'redux-saga/effects';
import fakeAPI from 'utils/fakeAPI';
import { api } from 'utils/api';
import { deviceManagerAction as actions } from '.';

function* fetchDeviceIdentity() {
  try {
    const response = yield api.hr.device.identity();
    yield put(
      actions.fetchIdentitySuccess({
        identity: response,
        loading: false,
      }),
    );
  } catch (error) {
    yield put(actions.fetchIdentityFailure);
  }
}

function fetchDevicesAction(options) {
  return fakeAPI.get('hr/devices', {
    params: {
      page: options.params.page,
      limit: options.params.limit,
      search: options.params.search,
      status: options.params.status,
      health_status: options.params.health_status,
      code: options.params.code,
      ordering: options.params.ordering,
    },
  });
}

function deleteDevice(options) {
  return fakeAPI.delete(`/devices/${options.id}`);
}

function* fetchListDevice(action) {
  const { params } = action.payload;
  try {
    const response = yield call(fetchDevicesAction, {
      params,
    });
    yield put(actions.fetchListSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchListFailure(e));
  }
}

function* deleteDeviceAction(action) {
  try {
    const id = action.payload.IdDelete;
    yield call(deleteDevice, { id });
    yield put(actions.deleteSuccess());
  } catch (err) {
    yield put(actions.deleteFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* deviceManagerPageSaga() {
  yield* [
    takeLatest(actions.fetchList.type, fetchListDevice),
    takeLatest(actions.delete.type, deleteDeviceAction),
    takeLatest(actions.fetchIdentity.type, fetchDeviceIdentity),
  ];
}
