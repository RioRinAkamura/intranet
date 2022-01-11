import { call, put, takeLatest } from 'redux-saga/effects';
import { ProjectNoteQueryParams } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { api } from 'utils/api';
import { Actions as actions } from '.';

export function* fetchProjectNotes(action) {
  try {
    const { projectId, params } = action.payload;
    const queryParams: ProjectNoteQueryParams = {
      category: params.category,
      date: params.content,
      summary: params.summary,
    };
    const response = yield call(
      [api, api.hr.project.note.list],
      projectId,
      params.search,
      { ...queryParams },
      params.ordering,
      params.page,
      params.limit,
    );

    yield put(actions.fetchProjectNotesSuccess(response));
  } catch (err) {
    yield put(actions.fetchProjectNotesFailure);
  }
}

function* createProjectNote(action) {
  try {
    yield call(
      [api, api.hr.project.note.create],
      action.payload.project,
      action.payload,
    );
    yield put(actions.createProjectNoteSuccess());
  } catch (err) {
    console.log(err);
    yield put(actions.createProjectNoteFailure);
  } finally {
    yield put(actions.resetState());
  }
}

function* updateProjectNote(action) {
  try {
    yield call(
      [api, api.hr.project.note.update],
      action.payload.project,
      action.payload,
    );
    yield put(actions.updateProjectNoteSuccess());
  } catch (err) {
    yield put(actions.updateProjectNoteFailure);
  } finally {
    yield put(actions.resetState());
  }
}

function* deleteProjectNote(action) {
  try {
    yield call(
      [api, api.hr.project.note.delete],
      action.payload.project_id,
      action.payload.id,
    );
    yield put(actions.deleteProjectNoteSuccess());
  } catch (err) {
    yield put(actions.deleteProjectNoteFailure);
  } finally {
    yield put(actions.resetState());
  }
}

function* deleteMultipleProjectNotes(action) {
  try {
    yield put(actions.deleteMultipleProjectNotesSuccess());
  } catch (err) {
    yield put(actions.deleteMultipleProjectNotesFailure);
  } finally {
    yield put(actions.resetState());
  }
}

export function* projectNoteSaga() {
  yield* [
    takeLatest(actions.fetchProjectNotes.type, fetchProjectNotes),
    takeLatest(actions.createProjectNote.type, createProjectNote),
    takeLatest(actions.updateProjectNote.type, updateProjectNote),
    takeLatest(actions.deleteProjectNote.type, deleteProjectNote),
    takeLatest(
      actions.deleteMultipleProjectNotes.type,
      deleteMultipleProjectNotes,
    ),
  ];
}
