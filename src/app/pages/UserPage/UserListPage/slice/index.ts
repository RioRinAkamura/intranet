import { PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userspageSaga } from './saga';
import { QueryParams, UserspageState, UserResponse } from './types';

export const initialState: UserspageState = {
  users: [],
  loading: false,
  isFilter: true,
  params: {
    limit: 20,
    page: 1,
  },
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
};

const slice = createSlice({
  name: 'userspage',
  initialState,
  reducers: {
    fetchUsers(state, action: PayloadAction<UserspageState>) {
      state.loading = true;
    },
    fetchUsersSuccess(state, action: PayloadAction<UserResponse>) {
      state.users = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
    },
    fetchUsersFailure(state, action: PayloadAction<UserspageState>) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeUsersState(state, action: PayloadAction<UserspageState>) {
      state.params = { ...state.params, ...action.payload.params };
      state.isFilter = false;
    },
    notQuery(state) {
      state.isFilter = false;
    },
    filterColumns(
      state,
      action: PayloadAction<{
        searchTextColumns: string[];
        searchedColumns: string[];
      }>,
    ) {
      state.filterFolumns = { ...action.payload };
    },
  },
});

export const { actions: userspageActions } = slice;

export const useUserspageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userspageSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useUserspageSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
