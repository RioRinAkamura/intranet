import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  UsersManagePageState,
  UserManageResponse,
  TablePagination,
} from './types';
import { usersManagePageSaga } from './saga';
import { Key } from 'react';
import { User } from '@hdwebsoft/intranet-api-sdk/libs/api/user/models';

export const initialState: UsersManagePageState = {
  users: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  // errorCode: 0,
  selectedRowKeys: [],
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  params: {
    status: 'active',
    limit: 20,
    page: 1,
  },
  filterColumns: {},
  errorMessage: '',
};

const slice = createSlice({
  name: 'usersmanagepage',
  initialState,
  reducers: {
    fetchUsers(state, action: PayloadAction<UsersManagePageState>) {
      state.loading = true;
    },
    fetchUsersSuccess(state, action: PayloadAction<UserManageResponse>) {
      state.loading = false;
      state.users = action.payload.results;
      state.pagination!.total = Number(action.payload.count);
      state.pagination!.current = Number(state.params.page);
      state.pagination!.pageSize = Number(state.params.limit);
    },
    fetchUsersError(state, action: PayloadAction<UsersManagePageState>) {
      state.loading = false;
    },
    setSelectedRows<T>(
      state,
      action: PayloadAction<{
        selectedRowKeys?: Key[];
        selectedRows?: T[];
      }>,
    ) {
      state.selectedRowKeys = action.payload.selectedRowKeys;
      state.selectedRows = action.payload.selectedRows;
    },
    setSearchText(state, action: PayloadAction<{ text: string }>) {
      state.params.search = action.payload.text;
      if (state.params.page && state.params.page > 1) {
        state.params.page = 1;
      }
    },
    resetSearch(state) {
      state.filterColumns = {};
      state.params = {
        limit: 20,
        page: 1,
        ordering: '',
      };
      state.selectedRowKeys = undefined;
      state.selectedRows = undefined;
    },
    setPagination(state, action: PayloadAction<TablePagination>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
    },
    updateUser(state, action) {
      state.loading = true;
    },
    updateUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      if (state.users) {
        const foundIndex = state.users.findIndex(user => {
          return user.id === action.payload.id;
        });
        state.users[foundIndex] = action.payload;
      }
    },
    updateUserFailure(state, action) {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteUserSuccess(state) {
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteUserFailure(state, action: PayloadAction<string>) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
      state.errorMessage = action.payload;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
      state.errorMessage = '';
    },
  },
});

export const { actions: UserManageAction } = slice;

export const useUsersManagePageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: usersManagePageSaga });
  return { actions: slice.actions };
};
