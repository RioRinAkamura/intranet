import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { Actions as actions } from '.';

export function* fetchIdentity() {
  try {
    const response = yield api.hr.employee.identity();
    yield put(
      actions.fetchIdentitySuccess({
        identity: response,
        error: false,
        loading: false,
      }),
    );
  } catch (error) {
    yield put(actions.fetchIdentityFailure());
  }
}

export function* fetchEmployeeSkills(action: PayloadAction<string>) {
  try {
    const response = yield api.hr.employee.skill.list(action.payload);
    yield put(
      actions.fetchEmployeeSkillsSuccess({
        list: response,
        error: false,
        loading: false,
      }),
    );
  } catch (error) {
    yield put(actions.fetchEmployeeSkillsFailure());
  }
}

export function* userDetailsSaga() {
  yield* [
    takeLatest(actions.fetchIdentity.type, fetchIdentity),
    takeLatest(actions.fetchEmployeeSkills.type, fetchEmployeeSkills),
  ];
}
