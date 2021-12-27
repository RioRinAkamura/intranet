import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { employeeProjectActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { DeleteEmployeeProjectParam, EmployeeProject } from './types';

function* fetchEmployeeProject(action) {
  try {
    const { params } = action.payload;
    const id = action.payload.id;

    const response = yield call(
      [api, api.hr.employee.project.list],
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

function* addProject(action: PayloadAction<EmployeeProject>) {
  try {
    const member = cloneDeep(action.payload);
    yield api.hr.employee.project.create(member.employeeId, member.data);
    yield put(actions.addProjectSuccess());
  } catch (err) {
    yield put(actions.addProjectFailure());
  } finally {
    yield put(actions.resetStateAddModal());
  }
}

function* editProject(action: PayloadAction<EmployeeProject>) {
  try {
    const member = cloneDeep(action.payload);
    yield api.hr.employee.project.update(member.employeeId, member.data);
    yield put(actions.editProjectSuccess());
  } catch (err) {
    yield put(actions.editProjectFailure());
  } finally {
    yield put(actions.resetStateEditModal());
  }
}

function* deleteProject(action: PayloadAction<DeleteEmployeeProjectParam>) {
  try {
    const { employeeId, projectId } = action.payload;
    yield api.hr.employee.project.delete(employeeId, projectId);
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
