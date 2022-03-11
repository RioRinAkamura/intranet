import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { employeeTimesheetActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { DeleteEmployeeTimesheetParams, EmployeeTimesheet } from './types';

function* fetchEmployeeTimesheet(action) {
  try {
    const { params } = action.payload;
    const id = action.payload.id;

    const response = yield call(
      [api, api.hr.employee.timesheet.list],
      id,
      params.search,
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchEmployeeTimesheetSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeTimesheetFailure);
  }
}

function* addTimesheet(action: PayloadAction<EmployeeTimesheet>) {
  try {
    const timesheet = cloneDeep(action.payload);
    yield api.hr.employee.timesheet.create(
      timesheet.employeeId,
      timesheet.data,
    );

    yield put(actions.addTimesheetSuccess());
  } catch (err) {
    yield put(actions.addTimesheetFailure());
  } finally {
    yield put(actions.resetStateAddModal());
  }
}

// function* editTimesheet(action: PayloadAction<EmployeeTimesheet>) {
//   try {
//     const timesheet = cloneDeep(action.payload);
//     yield api.hr.employee.project.update(timesheet.employeeId, timesheet.data);
//     yield put(actions.editTimesheetSuccess());
//   } catch (err) {
//     yield put(actions.editTimesheetFailure());
//   } finally {
//     yield put(actions.resetStateEditModal());
//   }
// }

function* deleteTimesheet(
  action: PayloadAction<DeleteEmployeeTimesheetParams>,
) {
  try {
    const { employeeId, timesheetId } = action.payload;
    yield api.hr.employee.project.delete(employeeId, timesheetId);
    yield put(actions.deleteTimesheetSuccess());
  } catch (err) {
    yield put(actions.deleteTimesheetFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* employeeTimesheetSaga() {
  yield* [
    takeLatest(actions.fetchEmployeeTimesheet.type, fetchEmployeeTimesheet),
    // takeLatest(actions.addTimesheet.type, addTimesheet),
    // takeLatest(actions.editTimesheet.type, editTimesheet),
    takeLatest(actions.deleteTimesheet.type, deleteTimesheet),
  ];
}
