import fakeAPI from 'utils/fakeAPI';
import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { projectsActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';

function* fetchProjects(action) {
  try {
    const { params } = action.payload;
    console.log(params);
    const queryParams = {
      name: params.name,
      priority: params.priority,
      status: params.status,
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

    const response = yield call(fakeAPI.get, '/hr/projects');

    yield put(actions.fetchProjectsSuccess(response));
  } catch (err) {
    console.log(err);
    yield put(actions.fetchProjectsFailure);
  }
}

// function* deleteUser(action: PayloadAction<string>) {
//   try {
//     const idDelete = action.payload;
//     yield call([api, api.hr.employee.delete], idDelete);
//     yield put(actions.deleteUserSuccess());
//   } catch (err) {
//     yield put(actions.deleteUserFailure());
//   } finally {
//     yield put(actions.resetStateDeleteModal());
//   }
// }

export function* projectsSaga() {
  yield* [
    takeLatest(actions.fetchProjects.type, fetchProjects),
    // takeLatest(actions.deleteUser.type, deleteUser),
  ];
}
