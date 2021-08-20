import { put, call, takeLatest } from 'redux-saga/effects';

import fakeAPI from 'utils/fakeAPI';

import { Actions as actions } from '.';
import { QueryParams } from './types';

export function* fetchEmployeeNotes(action) {
  try {
    const employee_id = action.payload.employee_id;
    const { params } = action.payload;
    const queryParams: QueryParams = {
      search: params.search,
      ordering: params.ordering,
      type: params.type,
      content: params.content,
      summary: params.summary,
      page: params.page,
      limit: params.limit,
    };

    const response = yield call(
      fakeAPI.get,
      `/hr/employees/${employee_id}/notes`,
      {
        params: { ...queryParams },
      },
    );

    yield put(actions.fetchEmployeeNotesSuccess(response));
  } catch (err) {
    yield put(actions.fetchEmployeeNotesFailure);
  }
}

function* createEmployeeNote(action) {
  try {
    yield call(
      fakeAPI.post,
      `/hr/employees/${action.payload.employee}/notes/`,
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
      fakeAPI.put,
      `/hr/employees/${action.payload.employee_id}/notes/${action.payload.note_id}`,
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
      fakeAPI.delete,
      `/hr/employees/${action.payload.employee_id}/notes/${action.payload.note_id}`,
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
