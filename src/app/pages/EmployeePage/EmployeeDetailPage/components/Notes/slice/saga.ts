import { put, call, takeLatest } from 'redux-saga/effects';
import { EmployeeNoteQueryParams } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

import { api } from 'utils/api';

import { Actions as actions } from '.';

export function* fetchEmployeeNotes(action) {
  try {
    const { employeeId, params } = action.payload;

    const queryParams: EmployeeNoteQueryParams = {
      category: params.category,
      date: params.content,
      summary: params.summary,
    };

    const response = yield call(
      [api, api.hr.employee.note.list],
      employeeId,
      params.search,
      { ...queryParams },
      params.ordering,
      params.page,
      params.limit,
    );

    yield put(actions.fetchEmployeeNotesSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeNotesFailure);
  }
}

function* createEmployeeNote(action) {
  try {
    yield call(
      [api, api.hr.employee.note.create],
      action.payload.employee,
      action.payload,
    );
    yield put(actions.createEmployeeNoteSuccess());
  } catch (err) {
    console.log(err);

    yield put(actions.createEmployeeNoteFailure);
  } finally {
    yield put(actions.resetState());
  }
}

function* updateEmployeeNote(action) {
  try {
    yield call(
      [api, api.hr.employee.note.update],
      action.payload.employee_id,
      action.payload,
    );
    yield put(actions.updateEmployeeNoteSuccess());
  } catch (err) {
    yield put(actions.updateEmployeeNoteFailure);
  } finally {
    yield put(actions.resetState());
  }
}

function* deleteEmployeeNote(action) {
  try {
    yield call(
      [api, api.hr.employee.note.delete],
      action.payload.employee_id,
      action.payload.note_id,
    );
    yield put(actions.deleteEmployeeNoteSuccess());
  } catch (err) {
    yield put(actions.deleteEmployeeNoteFailure());
  } finally {
    yield put(actions.resetState());
  }
}

function* deleteMultipleEmployeeNotes(action) {
  const { employeeId, data } = action.payload;

  try {
    yield call([api, api.hr.employee.note.bulkDelete], employeeId, data);
    yield put(actions.deleteMultipleEmployeeNotesSuccess());
  } catch (err) {
    yield put(actions.deleteMultipleEmployeeNotesFailure());
  } finally {
    yield put(actions.resetState());
  }
}

export function* employeeNoteSaga() {
  yield* [
    takeLatest(actions.fetchEmployeeNotes.type, fetchEmployeeNotes),
    takeLatest(actions.createEmployeeNote.type, createEmployeeNote),
    takeLatest(actions.updateEmployeeNote.type, updateEmployeeNote),
    takeLatest(actions.deleteEmployeeNote.type, deleteEmployeeNote),
    takeLatest(
      actions.deleteMultipleEmployeeNotes.type,
      deleteMultipleEmployeeNotes,
    ),
  ];
}
