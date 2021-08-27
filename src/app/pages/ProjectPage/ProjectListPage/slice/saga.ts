import { api } from 'utils/api';
import { call, put, takeLatest } from 'redux-saga/effects';
import { projectsActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';

function* fetchProjectIdentity() {
  try {
    const response = yield api.project.identity();
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
    };
    const response = yield call(
      [api, api.project.list],
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
    yield call([api, api.project.delete], idDelete);
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
    takeLatest(actions.fetchIdentity.type, fetchProjectIdentity),
  ];
}
