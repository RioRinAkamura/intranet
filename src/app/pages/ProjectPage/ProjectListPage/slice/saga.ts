import fakeAPI from 'utils/fakeAPI';
import { api } from 'utils/api';
import { call, put, takeLatest } from 'redux-saga/effects';
// import { api } from 'utils/api';
import { projectsActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import qs from 'query-string';
// import { PayloadAction } from '@reduxjs/toolkit';

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
      search: params.search,
      ordering: params.ordering,
      name: params.name,
      priority: params.priority,
      status: params.status,
      page: params.page,
      limit: params.limit,
      employee_id: params.employee,
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
      paramsSerializer: params => {
        return qs.stringify(params);
      },
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
    takeLatest(actions.fetchIdentity.type, fetchProjectIdentity),
  ];
}
