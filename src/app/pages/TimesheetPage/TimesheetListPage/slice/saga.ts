import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { projectTimesheetActions as actions } from '.';
import { DeleteProjectTimesheetParams } from './types';

function* fetchProjectTimesheet(action) {
  try {
    const { params } = action.payload;
    const response = yield call(
      [api, api.hr.projectTimesheet.list],
      params.search,
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchProjectTimesheetSuccess(response));
  } catch (err) {
    yield put(actions.fetchProjectTimesheetFailure);
  }
}

// function* addTimesheet(action: PayloadAction<ProjectTimesheet>) {
//   try {
//     const timesheet = cloneDeep(action.payload);
//     yield api.hr.project.timesheet.create(
//       timesheet.projectId,
//       timesheet.data,
//     );

//     yield put(actions.addTimesheetSuccess());
//   } catch (err) {
//     yield put(actions.addTimesheetFailure());
//   } finally {
//     yield put(actions.resetStateAddModal());
//   }
// }

// function* editTimesheet(action: PayloadAction<ProjectTimesheet>) {
//   try {
//     const timesheet = cloneDeep(action.payload);
//     yield api.hr.project.project.update(timesheet.projectId, timesheet.data);
//     yield put(actions.editTimesheetSuccess());
//   } catch (err) {
//     yield put(actions.editTimesheetFailure());
//   } finally {
//     yield put(actions.resetStateEditModal());
//   }
// }

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
    // takeLatest(actions.addTimesheet.type, addTimesheet),
    // takeLatest(actions.editTimesheet.type, editTimesheet),
    takeLatest(actions.deleteTimesheet.type, deleteTimesheet),
  ];
}
