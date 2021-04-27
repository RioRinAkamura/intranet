import { call, put, takeLatest } from 'redux-saga/effects';
import { api } from 'utils/api';
import { userspageActions as actions } from '.';

function* fetchUsers(action) {
  try {
    const { params } = action.payload;
    const queryParams = {
      first_name: params.first_name,
      last_name: params.last_name,
      code: params.code,
      phone: params.phone,
      email: params.email,
    };
    const response = yield call(
      [api, api.hr.employee.list],
      params.search,
      {
        ...queryParams,
      },
      params.ordering,
      params.page,
      params.limit,
    );
    yield put(actions.fetchUsersSuccess(response));
  } catch (err) {
    console.log(err);
    yield put(actions.fetchUsersFailure);
  }
}

export function* userspageSaga() {
  yield* [takeLatest(actions.fetchUsers.type, fetchUsers)];
}
