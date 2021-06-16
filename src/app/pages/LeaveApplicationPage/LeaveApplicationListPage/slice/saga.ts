import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { leaveApplicationPageActions as actions } from '.';
import { PayloadAction } from '@reduxjs/toolkit';
import { Delete } from './types';

function* fetchLeaveApplications(action) {
  try {
    const { params } = action.payload;
    const queryParams = {
      employee_name: params.employee_name,
      phone: params.phone,
      email: params.email,
      title: params.title,
      description: params.description,
      start_date: params.start_date,
      end_date: params.end_date,
      working_type: params.working_type,
      approval_status: params.approval_status,
    };
    const response = yield call(
      [api, api.hr.employeeLeave.list],
      params.search,
      {
        ...queryParams,
      },
      params.ordering,
      params.page,
      params.limit,
    );

    yield put(actions.fetchListSuccess(response));
  } catch (err) {
    console.log(err);
    yield put(actions.fetchListFailure);
  }
}

function* deleteLeaveApplication(action: PayloadAction<Delete>) {
  try {
    const id = action.payload.IdDelete;
    const ids = action.payload?.ids || [];
    yield call([api, api.hr.employeeLeave.delete], id, ids);
    yield put(actions.deleteSuccess());
  } catch (err) {
    yield put(actions.deleteFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* leaveApplicationPageSaga() {
  yield* [
    takeLatest(actions.fetchList.type, fetchLeaveApplications),
    takeLatest(actions.delete.type, deleteLeaveApplication),
  ];
}
