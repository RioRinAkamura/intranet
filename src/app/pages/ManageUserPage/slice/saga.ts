import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { UserManageAction as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { mapErrorCode } from 'utils/errorMessages';
import { User } from '@hdwebsoft/intranet-api-sdk/libs/api/user/models';

function fetchUsersAction(options) {
  return api.user.list(
    options.params.search,
    {
      email: options.params.email,
    },
    options.params.ordering,
    options.params.page,
    options.params.limit,
  );
}

function updateUserAction(data) {
  return api.user.updateUser(data);
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
    const response: User = yield call(updateUserAction, user);
    yield put(actions.updateUserSuccess(response));
  } catch (err) {
    console.log(err);
    const errorMess = mapErrorCode(err);
    yield put(actions.updateUserFailure(errorMess));
  } finally {
    yield put(actions.resetStateDeleteModal());
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
