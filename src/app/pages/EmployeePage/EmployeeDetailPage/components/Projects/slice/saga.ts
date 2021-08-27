import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { employeeProjectActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { AddProject } from './types';
import { cloneDeep } from 'lodash';

function* fetchEmployeeProject(action) {
  try {
    const { params } = action.payload;
    const id = action.payload.id;

    const response = yield call(
      [api, api.employee.project.list],
      id,
      params.search,
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchEmployeeProjectSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeProjectFailure);
  }
}

function* addProject(action: PayloadAction<AddProject>) {
  try {
    const member = cloneDeep(action.payload);
    member.allocation = parseFloat(member.allocation).toFixed(1);
    yield api.project.createMember(member.project, member as any);
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

    yield api.project.updateMember(
      member.project,
      member.employee,
      member as any,
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
    yield call([api, api.project.delete], idDelete);
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
