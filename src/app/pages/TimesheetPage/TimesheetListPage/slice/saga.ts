import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { projectTimesheetActions as actions } from '.';
import { DeleteProjectTimesheetParams } from './types';

function* fetchProjectTimesheet(action) {
  const { params } = action.payload;
  // const queryParams = {
  //   work_status: params.work_status,
  // };
  try {
    const response = yield call(
      [api, api.hr.projectTimesheet.list],
      params.search,
      // { ...queryParams },
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchProjectTimesheetSuccess(response));
  } catch (err) {
    yield put(actions.fetchProjectTimesheetFailure);
  }
}

function* deleteTimesheet(action: PayloadAction<DeleteProjectTimesheetParams>) {
  try {
    const { timesheetId } = action.payload;
    yield api.hr.projectTimesheet.delete(timesheetId);
    yield put(actions.deleteTimesheetSuccess());
  } catch (err) {
    yield put(actions.deleteTimesheetFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* projectTimesheetSaga() {
  yield* [
    takeLatest(actions.fetchProjectTimesheet.type, fetchProjectTimesheet),
    takeLatest(actions.deleteTimesheet.type, deleteTimesheet),
  ];
}
