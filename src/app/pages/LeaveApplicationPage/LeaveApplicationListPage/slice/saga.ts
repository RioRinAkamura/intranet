import { UpdateEmployeeLeaveParams } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { call, put, takeLatest } from 'redux-saga/effects';
import { EmployeesLeaveActions as actions } from '.';
import { api } from 'utils/api';

function fetchEmployeesLeaveActions(options) {
  return api.hr.leave.list(
    options.params.search,
    {
      title: options.params.title,
    },
    options.params.ordering,
    options.params.page,
    options.params.limit,
  );
}

function updateEmployeesLeaveActions(
  id: string,
  data: UpdateEmployeeLeaveParams,
) {
  return api.hr.leave.update(id, data);
}

function* fetchEmployeesLeave(action) {
  const { params } = action.payload;
  try {
    const response = yield call(fetchEmployeesLeaveActions, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });
    yield put(actions.fetchEmployeesLeaveSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchEmployeeLeavesFailed(e));
  }
}

export function* employeeLeavePageSaga() {
  yield* [takeLatest(actions.fetchEmployeesLeave.type, fetchEmployeesLeave)];
}
