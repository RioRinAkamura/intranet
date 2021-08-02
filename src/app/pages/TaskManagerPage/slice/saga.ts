import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from 'utils/api';
import { taskManagerAction as actions } from '.';

function* fetchListTask(action) {
  const { params } = action.payload;
  const queryParams = {
    status: params.status,
    title: params.title,
    project: params.project,
    assignee: params.assignee,
    // code: params.params.code,
    ordering: params.ordering,
  };

  try {
    const response = yield call(
      [api, api.hr.task.list],
      params.search,
      { ...queryParams },
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchListSuccess(response));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchListFailure(e));
  }
}

function* deleteTask(action) {
  try {
    const id = action.payload.IdDelete;
    yield call([api, api.hr.task.delete], id);
    yield put(actions.deleteSuccess());
  } catch (err) {
    yield put(actions.deleteFailure());
  } finally {
    yield put(actions.resetStateDeleteModal());
  }
}

export function* taskManagerPageSaga() {
  yield* [takeLatest(actions.fetchList.type, fetchListTask)];
  yield* [takeLatest(actions.delete.type, deleteTask)];
}
