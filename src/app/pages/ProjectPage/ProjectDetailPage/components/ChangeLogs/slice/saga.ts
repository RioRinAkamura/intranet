import { call, put, takeLatest } from 'redux-saga/effects';

import { api } from 'utils/api';
import { projectChangeLogsActions as actions } from '.';

function* fetchProjectChangeLogs(action) {
  try {
    const { params, project_id } = action.payload;
    const response = yield call(
      [api, api.hr.project.getLogs],
      project_id,
      params.page,
      params.limit,
      params.ordering,
    );
    yield put(actions.fetchProjectChangeLogsSuccess(response));
  } catch (err) {
    yield put(actions.fetchProjectChangeLogsFailure);
  }
}

export function* projectChangeLogsSaga() {
  yield* [
    takeLatest(actions.fetchProjectChangeLogs.type, fetchProjectChangeLogs),
  ];
}
