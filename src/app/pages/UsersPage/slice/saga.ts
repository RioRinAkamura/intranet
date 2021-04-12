import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/sessionConfig';
import { userspageActions as actions } from '.';

function* getUsers() {
  try {
    const response = yield call(() => {
      return api.contact.list();
    });
    console.log(response.json());
  } catch (err) {}
}

function* searchUsers(action) {
  try {
    // declare
    // call api
    const response = yield call(() => {});
    yield put(actions.searchUsersSuccess);
  } catch (err) {
    console.log(err);
    yield put(actions.searchUsersFailure);
  }
}

function* createUser(action) {
  try {
    // declare
    // call api
    const response = yield call(() => {});
    yield put(actions.createUserSuccess);
  } catch (err) {
    console.log(err);
    yield put(actions.createUserFailure);
  }
}

function* editUser(action) {
  try {
    // declare
    // call api
    const response = yield call(() => {});
    yield put(actions.editUserSuccess);
  } catch (err) {
    console.log(err);
    yield put(actions.editUserFailure);
  }
}

function* deleteUser(action) {
  try {
    // declare
    // call api
    const response = yield call(() => {});
    yield put(actions.deleteUserSuccess);
  } catch (err) {
    console.log(err);
    yield put(actions.deleteUserFailure);
  }
}

function* importUsers(action) {
  try {
    // declare
    // call api
    const response = yield call(() => {});
    yield put(actions.importUsersSuccess);
  } catch (err) {
    console.log(err);
    yield put(actions.importUsersFailure);
  }
}

export function* userspageSaga() {
  yield [
    takeLatest(actions.fetchUsers.type, getUsers),
    takeLatest(actions.createUser.type, createUser),
    takeLatest(actions.editUser.type, editUser),
    takeLatest(actions.deleteUser.type, deleteUser),
    takeLatest(actions.searchUsers.type, searchUsers),
    takeLatest(actions.importUsers.type, importUsers),
  ];
}
