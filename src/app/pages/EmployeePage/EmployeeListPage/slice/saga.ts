import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { userspageActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';

function* fetchUsers(action) {
  try {
    const { params } = action.payload;
    const queryParams = {
      first_name: params.first_name,
      last_name: params.last_name,
      code: params.code,
      phone: params.phone,
      email: params.email,
      tags: params.tags,
      monitoring: params.monitoring,
      total_allocated_hour_greater: params.from,
      total_allocated_hour_less: params.to,
      total_allocated_hour_exact: params.exact,
      allocable: params.allocable,
    };
    const response = yield call(
      [api, api.hr.employee.list],
      params.search,
      {
        ...queryParams,
      },
      params.ordering,
      params.page,
      params.limit,
    );

    yield put(actions.fetchUsersSuccess(response));
  } catch (err) {
    console.log(err);
    yield put(actions.fetchUsersFailure);
  }
}

function* deleteUser(action: PayloadAction<string>) {
  try {
    const idDelete = action.payload;
    yield call([api, api.hr.employee.delete], idDelete);
    yield put(actions.deleteUserSuccess());
  } catch (err) {
    yield put(actions.deleteUserFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* userspageSaga() {
  yield* [
    takeLatest(actions.fetchUsers.type, fetchUsers),
    takeLatest(actions.deleteUser.type, deleteUser),
  ];
}
