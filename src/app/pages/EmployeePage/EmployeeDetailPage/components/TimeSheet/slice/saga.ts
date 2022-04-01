import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { employeeTimesheetActions as actions } from '.';
import { DeleteEmployeeTimesheetParams } from './types';

function* fetchEmployeeTimesheet(action) {
  try {
    const { params, id } = action.payload;
    // const queryParams = {
    //   work_status: params.work_status,
    //   date: params.date,
    // };

    const response = yield call(
      [api, api.hr.employee.timesheet.list],
      id,
      params.search,
      // { ...queryParams },
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchEmployeeTimesheetSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeTimesheetFailure);
  }
}

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
