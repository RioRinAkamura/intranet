import fakeAPI from 'utils/fakeAPI';
import { call, put, takeLatest } from 'redux-saga/effects';
// import { api } from 'utils/api';
import { employeeProjectActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
// import { PayloadAction } from '@reduxjs/toolkit';

function* fetchEmployeeProject(action) {
  try {
    const { params } = action.payload;
    const id = action.payload.id;
    const queryParams = {
      search: params.search,
      ordering: params.ordering,
      project__name: params.project__name,
      page: params.page,
      limit: params.limit,
    };

    const response = yield call(fakeAPI.get, `/hr/employees/${id}/projects`, {
      params: { ...queryParams },
    });

    yield put(actions.fetchEmployeeProjectSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeProjectFailure);
  }
}

function* deleteProject(action: PayloadAction<string>) {
  try {
    const idDelete = action.payload;
    yield call(fakeAPI.delete, `/hr/projects/${idDelete}/`);
    yield put(actions.deleteProjectSuccess());
  } catch (err) {
    yield put(actions.deleteProjectFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* employeeProjectSaga() {
  yield* [
    takeLatest(actions.fetchEmployeeProject.type, fetchEmployeeProject),
    takeLatest(actions.deleteProject.type, deleteProject),
  ];
}
