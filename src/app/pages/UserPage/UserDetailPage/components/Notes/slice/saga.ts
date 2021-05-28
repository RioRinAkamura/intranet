import { put, takeLatest } from 'redux-saga/effects';
import { Actions as actions } from '.';

export function* fetchNotes(action) {
  try {
  } catch (error) {
    yield put(actions.fetchNotesFailure());
  }
}

export function* notesSaga() {
  yield* [takeLatest(actions.fetchNotes.type, fetchNotes)];
}
