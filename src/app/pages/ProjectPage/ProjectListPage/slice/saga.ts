import fakeAPI from 'utils/fakeAPI';
import { call, put, takeLatest } from 'redux-saga/effects';
// import { api } from 'utils/api';
import { projectsActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
// import { PayloadAction } from '@reduxjs/toolkit';

function* fetchProjects(action) {
  try {
    const { params } = action.payload;
    const queryParams = {
      search: params.search,
      ordering: params.ordering,
      name: params.name,
      priority: params.priority,
      status: params.status,
      page: params.page,
      limit: params.limit,
    };
    // const response = yield call(
    //   [api, api.hr.employee.list],
    //   params.search,
    //   {
    //     ...queryParams,
    //   },
    //   params.ordering,
    //   params.page,
    //   params.limit,
    // );

    const response = yield call(fakeAPI.get, '/hr/projects', {
      params: { ...queryParams },
    });

    yield put(actions.fetchProjectsSuccess(response));
  } catch (err) {
    yield put(actions.fetchProjectsFailure);
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

export function* projectsSaga() {
  yield* [
    takeLatest(actions.fetchProjects.type, fetchProjects),
    takeLatest(actions.deleteProject.type, deleteProject),
  ];
}
