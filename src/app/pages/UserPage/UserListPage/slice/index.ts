import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userspageSaga } from './saga';
import { UserspageState } from './types';

export const initialState: UserspageState = {
  users: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
};

const slice = createSlice({
  name: 'userspage',
  initialState,
  reducers: {
    fetchUsers() {},
    fetchUsersSuccess() {},
    fetchUsersFailure() {},
    searchUsers(state, action: PayloadAction<any>) {},
    searchUsersSuccess() {},
    searchUsersFailure() {},
    createUser(state, action: PayloadAction<any>) {},
    createUserSuccess() {},
    createUserFailure() {},
    editUser(state, action: PayloadAction<any>) {},
    editUserSuccess() {},
    editUserFailure() {},
    deleteUser(state, action: PayloadAction<string>) {
      state.loading = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteUserSuccess(state) {
      state.loading = false;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteUserFailure(state) {
      state.loading = false;
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.loading = false;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    importUsers(state, action: PayloadAction<any>) {},
    importUsersSuccess() {},
    importUsersFailure() {},
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
