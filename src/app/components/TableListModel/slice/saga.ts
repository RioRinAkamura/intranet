import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { PayloadAction } from '@reduxjs/toolkit';
import { Delete } from './types';
import { tableActions } from '.';
import { RootStateKeyType } from 'utils/types/injector-typings';

function* fetchList(action) {
  const { params, model } = action.payload;
  const actions = tableActions(model);
  try {
    const queryParams = {};
    Object.keys(params).forEach(key => {
      if (!['search', 'ordering', 'page', 'limit'].includes(key)) {
        queryParams[key] = params[key];
      }
    });
    const response = yield call(
      [api, api.hr[model].list],
      params.search,
      queryParams,
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchListSuccess(response));
  } catch (err) {
    console.log(err);
    yield put(actions.fetchListFailure);
  }
}

function* deleteItem(action: PayloadAction<Delete>) {
  const { model, id } = action.payload;
  const ids = action.payload?.ids || [];
  const actions = tableActions(model);

  try {
    yield call([api, api.hr[model].delete], id, ids);
    yield put(actions.deleteSuccess());
  } catch (err) {
    yield put(actions.deleteFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* TableSaga() {
  const model = sessionStorage.getItem('model') as RootStateKeyType;
  const actions = tableActions(model);
  yield* [
    takeLatest(actions.fetchList.type, fetchList),
    takeLatest(actions.delete.type, deleteItem),
  ];
}
