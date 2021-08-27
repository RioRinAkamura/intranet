import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from 'utils/api';
import { deviceManagerAction as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { Delete } from './types';

function* fetchDeviceIdentity() {
  try {
    const response = yield api.device.identity();
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

function* fetchListDevice(action) {
  const { params } = action.payload;
  try {
    const queryParams = {
      code: params.code,
      health_status: params.health_status,
      status: params.status,
    };

    const response = yield call(
      [api, api.device.list],
      params.search,
      {
        ...queryParams,
      },
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchListSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchListFailure(e));
  }
}

function* deleteDeviceAction(action: PayloadAction<Delete>) {
  try {
    const id = action.payload.IdDelete;
    if (id) yield call([api, api.device.delete], id);
    yield put(actions.deleteSuccess());
  } catch (err) {
    yield put(actions.deleteFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

function* deleteMultiDevice(action: PayloadAction<Delete>) {
  try {
    const ids = action.payload.ids;
    if (ids) yield api.device.deleteMultiple(ids);
    yield put(actions.deleteMultiSuccess());
  } catch (err) {
    yield put(actions.deleteMultiFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* deviceManagerPageSaga() {
  yield* [
    takeLatest(actions.fetchList.type, fetchListDevice),
    takeLatest(actions.delete.type, deleteDeviceAction),
    takeLatest(actions.deleteMulti.type, deleteMultiDevice),
    takeLatest(actions.fetchIdentity.type, fetchDeviceIdentity),
  ];
}
