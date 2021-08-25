import { put, call, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';

import { Actions as actions } from '.';
import { QueryParams } from './types';

export function* fetchEmployeeNotes(action) {
  try {
    const employee_id = action.payload.employee_id;
    const { params } = action.payload;
    const queryParams: QueryParams = {
      type: params.type,
      content: params.content,
      summary: params.summary,
    };

    const response = yield call(
      [api, api.hr.employee.getNotes],
      employee_id,
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
      [api, api.hr.employee.postNote],
      action.payload.employee,
      action.payload,
    );
    yield put(actions.createEmployeeNoteSuccess());
  } catch (err) {
    yield put(actions.createEmployeeNoteFailure);
  } finally {
    yield put(actions.resetState());
  }
}

function* updateEmployeeNote(action) {
  try {
    yield call(
      [api, api.hr.employee.putNote],
      action.payload.employee_id,
      action.payload.note_id,
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
      [api, api.hr.employee.deleteNote],
      action.payload.employee_id,
      action.payload.note_id,
    );
    yield put(actions.deleteEmployeeNoteSuccess());
  } catch (err) {
    yield put(actions.deleteEmployeeNoteFailure);
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
  ];
}
