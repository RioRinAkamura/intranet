import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import fakeAPI from 'utils/fakeAPI';
import { UserManageAction as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { mapErrorCode } from 'utils/errorMessages';

function fetchUsersAction(options) {
  return fakeAPI.get('/users/', {
    params: {
      page: options.params.page,
      limit: options.params.limit,
      search: options.params.search,
    },
  });
}

function updateUserAction(data) {
  return fakeAPI.patch(`/users/${data.id}`, data);
}

function* fetchUsers(action) {
  const { params } = action.payload;

  try {
    const response = yield call(fetchUsersAction, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });
    yield put(actions.fetchUsersSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchUsersError(e));
  }
}

function* updateUser(action) {
  const { user } = action.payload;
  try {
    const response = yield call(updateUserAction, user);
    yield put(actions.updateUserSuccess(response));
  } catch (e) {
    console.log(e);
  }
}

function* deleteUser(action: PayloadAction<string>) {
  try {
    const idDelete = action.payload;
    yield call([api, api.user.deleteUser], idDelete);
    yield put(actions.deleteUserSuccess());
  } catch (err) {
    const errorMess = mapErrorCode(err);
    yield put(actions.deleteUserFailure(errorMess));
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* usersManagePageSaga() {
  yield* [takeLatest(actions.fetchUsers.type, fetchUsers)];
  yield* [takeLatest(actions.updateUser.type, updateUser)];
  yield* [takeLatest(actions.deleteUser.type, deleteUser)];
}
