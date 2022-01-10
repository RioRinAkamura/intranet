import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { employeeSkillActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { DeleteEmployeeSkillParam } from './types';
import { EmployeeSkill } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

function* fetchEmployeeSkill(action) {
  try {
    const { params } = action.payload;
    const id = action.payload.id;
    console.log('fetch employee skills');
    const response: EmployeeSkill[] = yield call(
      [api, api.hr.employee.skill.list],
      id,
      params.page,
      params.limit,
    );
    yield put(actions.fetchEmployeeSkillSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeSkillFailure);
  }
}

function* addSkill(action: PayloadAction<EmployeeSkill>) {
  try {
    // const member = cloneDeep(action.payload);
    // // Update after sdk
    // const temporary = {
    //   skill_id: action.payload.data.skillId,
    //   employee_id: action.payload.employeeId,
    // };
    // yield api.hr.employee.skill.create(member.employeeId, temporary);
    // yield put(actions.addSkillSuccess());
  } catch (err) {
    yield put(actions.addSkillFailure());
  } finally {
    yield put(actions.resetStateAddModal());
  }
}

function* editSkill(action: PayloadAction<any>) {
  try {
    const member = cloneDeep(action.payload);
    yield api.hr.employee.skill.update(member.employeeId, member);
    yield put(actions.editSkillSuccess());
  } catch (err) {
    yield put(actions.editSkillFailure());
  } finally {
    yield put(actions.resetStateEditModal());
  }
}

function* deleteSkill(action: PayloadAction<DeleteEmployeeSkillParam>) {
  try {
    const { employeeId, skillId } = action.payload;
    yield api.hr.employee.skill.delete(employeeId, skillId);
    yield put(actions.deleteSkillSuccess());
  } catch (err) {
    yield put(actions.deleteSkillFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* employeeSkillSaga() {
  yield* [
    takeLatest(actions.fetchEmployeeSkill.type, fetchEmployeeSkill),
    takeLatest(actions.addSkill.type, addSkill),
    takeLatest(actions.editSkill.type, editSkill),
    takeLatest(actions.deleteSkill.type, deleteSkill),
  ];
}
