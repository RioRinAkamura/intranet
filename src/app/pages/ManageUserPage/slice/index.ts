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
import { User } from '@hdwebsoft/boilerplate-api-sdk/libs/api/user/models';

export const initialState: UsersManagePageState = {
  users: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  selectedRowKeys: [],
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  params: {
    limit: 20,
    page: 1,
  },
  filterColumns: {},
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
    updateUserSuccess(state, action: PayloadAction<User>) {
      console.log(action, 'action');
    },
    updateUser(state, action) {
      console.log('update user');
    },
    deleteUser(state, action: PayloadAction<string>) {
      console.log('delete user');
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteUserSuccess(state) {
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteUserFailure(state) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
  },
});

export const { actions: UserManageAction } = slice;

export const useUsersManagePageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: usersManagePageSaga });
  return { actions: slice.actions };
};
