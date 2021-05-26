import fakeAPI from 'utils/fakeAPI';
import { call, put, takeLatest } from 'redux-saga/effects';
// import { api } from 'utils/api';
import { employeeProjectActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { AddProject } from './types';
import { cloneDeep } from 'lodash';
// import { PayloadAction } from '@reduxjs/toolkit';

function* fetchEmployeeProject(action) {
  try {
    const { params } = action.payload;
    const id = action.payload.id;
    const queryParams = {
      search: params.search,
      ordering: params.ordering,
      project__name: params.project__name,
      page: params.page,
      limit: params.limit,
    };

    const response = yield call(fakeAPI.get, `/hr/employees/${id}/projects`, {
      params: { ...queryParams },
    });

    yield put(actions.fetchEmployeeProjectSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeProjectFailure);
  }
}

function* addProject(action: PayloadAction<AddProject>) {
  try {
    const member = cloneDeep(action.payload);
    member.allocation = parseFloat(member.allocation).toFixed(1);
    yield call(fakeAPI.post, `/hr/projects/${member.project}/members/`, member);
    yield put(actions.addProjectSuccess());
  } catch (err) {
    yield put(actions.addProjectFailure());
  } finally {
    yield put(actions.resetStateAddModal());
  }
}

function* editProject(action: PayloadAction<AddProject>) {
  try {
    const member = cloneDeep(action.payload);
    member.allocation = parseFloat(member.allocation).toFixed(1);
    yield call(
      fakeAPI.patch,
      `/hr/projects/${member.project}/members/${member.employee}/`,
      member,
    );
    yield put(actions.editProjectSuccess());
  } catch (err) {
    yield put(actions.editProjectFailure());
  } finally {
    yield put(actions.resetStateEditModal());
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

export function* employeeProjectSaga() {
  yield* [
    takeLatest(actions.fetchEmployeeProject.type, fetchEmployeeProject),
    takeLatest(actions.addProject.type, addProject),
    takeLatest(actions.editProject.type, editProject),
    takeLatest(actions.deleteProject.type, deleteProject),
  ];
}
