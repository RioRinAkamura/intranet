import { takeLatest, call, put } from 'redux-saga/effects';
import fakeAPI from 'utils/fakeAPI';
import { taskManagerAction as actions } from '.';
import qs from 'query-string';

function fetchDevicesAction(options) {
  return fakeAPI.get('/hr/tasks', {
    params: {
      page: options.params.page,
      limit: options.params.limit,
      search: options.params.search,
      status: options.params.status,
      title: options.params.title,
      project: options.params.project,
      assignee: options.params.assignee,
      // code: options.params.code,
      ordering: options.params.ordering,
    },

    paramsSerializer: params => {
      return qs.stringify(params);
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

export function* taskManagerPageSaga() {
  yield* [takeLatest(actions.fetchList.type, fetchListDevice)];
  yield* [takeLatest(actions.delete.type, deleteDeviceAction)];
}
