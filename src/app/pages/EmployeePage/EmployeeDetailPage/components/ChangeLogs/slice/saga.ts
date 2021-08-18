import { call, put, takeLatest } from 'redux-saga/effects';

import { api } from 'utils/api';
import { employeeChangeLogsActions as actions } from '.';

function* fetchEmployeeChangeLogs(action) {
  try {
    const { params, employee_id } = action.payload;
    const response = yield call(
      [api, api.hr.employee.getLogs],
      employee_id,
      params.page,
      params.limit,
      params.ordering,
    );
    yield put(actions.fetchEmployeeChangeLogsSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeChangeLogsFailure);
  }
}

export function* employeeChangeLogsSaga() {
  yield* [
    takeLatest(actions.fetchEmployeeChangeLogs.type, fetchEmployeeChangeLogs),
  ];
}
