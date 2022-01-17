import { api } from 'utils/api';
import { call, put, takeLatest } from 'redux-saga/effects';
import { projectsActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';

function* fetchProjectIdentity() {
  try {
    const response = yield api.hr.project.identity();
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

function* fetchProjects(action) {
  try {
    const { params } = action.payload;
    const queryParams = {
      name: params.name,
      priority: params.priority,
      status: params.status,
      monitoring: params.monitoring,
      employee_id: params.employee_id,
      is_deleted: params.is_deleted,
    };
    if (Boolean(params.is_deleted) === false) {
      delete queryParams.is_deleted;
    }
    const response = yield call(
      [api, api.hr.project.list],
      params.search,
      {
        ...queryParams,
      },
      params.ordering,
      params.page,
      params.limit,
    );

    yield put(actions.fetchProjectsSuccess(response));
  } catch (err) {
    yield put(actions.fetchProjectsFailure);
  }
}

function* deleteProject(action: PayloadAction<string>) {
  try {
    const idDelete = action.payload;
    yield call([api, api.hr.project.delete], idDelete);
    yield put(actions.deleteProjectSuccess());
  } catch (err) {
    yield put(actions.deleteProjectFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

function* deleteMultiProject(action: PayloadAction<Array<string>>) {
  try {
    const ids = action.payload;
    yield call([api, api.hr.project.bulkDelete], ids);
    yield put(actions.deleteProjectSuccess());
  } catch (err) {
    yield put(actions.deleteProjectFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* projectsSaga() {
  yield* [
    takeLatest(actions.fetchProjects.type, fetchProjects),
    takeLatest(actions.deleteProject.type, deleteProject),
    takeLatest(actions.deleteMultiProject.type, deleteMultiProject),
    takeLatest(actions.fetchIdentity.type, fetchProjectIdentity),
  ];
}
