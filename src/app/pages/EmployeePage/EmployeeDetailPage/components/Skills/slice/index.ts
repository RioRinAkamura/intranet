import { PayloadAction } from '@reduxjs/toolkit';
import { TablePagination } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { Key } from 'react';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { employeeSkillSaga } from './saga';
import { EmployeeSkill as skill } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

import {
  DeleteEmployeeSkillParam,
  EmployeeSkill,
  EmployeeSkillState,
  FilterColumns,
  QueryParams,
} from './types';

export const initialState: EmployeeSkillState = {
  id: '',
  skills: [],
  loading: false,
  deleteSuccess: false,
  deleteFailed: false,
  isFilter: true,
  params: {
    limit: 1000,
    page: 1,
  },
  pagination: {
    pageSize: 20,
    current: 1,
    total: 20,
  },
  filterColumns: {},
  selectedRowKeys: [],
};

const slice = createSlice({
  name: 'employeeSkill',
  initialState,
  reducers: {
    fetchEmployeeSkill(state, action: PayloadAction<EmployeeSkillState>) {
      state.loading = true;
    },
    fetchEmployeeSkillSuccess(state, action: PayloadAction<skill[]>) {
      state.skills = action.payload;
      // state.pagination!.total = Number(action.payload.count);
      // state.pagination!.current = Number(state.params.page);
      // state.pagination!.pageSize = Number(state.params.limit);
      state.loading = false;
      state.isFilter = true;
    },
    fetchEmployeeSkillFailure(
      state,
      action: PayloadAction<EmployeeSkillState>,
    ) {
      state.error = action.payload.error;
      state.loading = false;
    },
    changeState(state, action: PayloadAction<QueryParams>) {
      state.params = { ...state.params, ...action.payload };
      state.filterColumns = {
        ...state.filterColumns,
        skill__name: action.payload.skill__name,
      };
      state.pagination = {
        ...state.pagination,
        current: action.payload.page,
        pageSize: action.payload.limit,
      };
      state.isFilter = false;
    },
    notQuery(state) {
      state.isFilter = false;
    },
    filterColumns(state, action: PayloadAction<FilterColumns>) {
      state.filterColumns = { ...state.filterColumns, ...action.payload };
      state.params = { ...state.params, ...action.payload };
    },
    selectedRows<T>(
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
    setOrdering(state, action: PayloadAction<string | undefined>) {
      state.params.ordering = action.payload;
    },
    setPagination(state, action: PayloadAction<TablePagination>) {
      state.params.limit = action.payload.pageSize;
      state.params.page = action.payload.current;
    },
    addSkill(state, action: PayloadAction<EmployeeSkill>) {
      state.isFilter = true;
      state.addSuccess = false;
      state.addFailed = false;
    },
    addSkillSuccess(state) {
      state.isFilter = false;
      state.addSuccess = true;
      state.addFailed = false;
    },
    addSkillFailure(state) {
      state.addSuccess = false;
      state.addFailed = true;
    },
    resetStateAddModal(state) {
      state.addSuccess = false;
      state.addFailed = false;
    },
    // Todo: Update type PayloadAction
    editSkill(state, action: PayloadAction<any>) {
      state.isFilter = true;
      state.editSuccess = false;
      state.editFailed = false;
    },
    editSkillSuccess(state) {
      state.isFilter = false;
      state.editSuccess = true;
      state.editFailed = false;
    },
    editSkillFailure(state) {
      state.editSuccess = false;
      state.editFailed = true;
    },
    resetStateEditModal(state) {
      state.editSuccess = false;
      state.editFailed = false;
    },
    deleteSkill(state, action: PayloadAction<DeleteEmployeeSkillParam>) {
      state.isFilter = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteSkillSuccess(state) {
      state.isFilter = false;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteSkillFailure(state) {
      state.deleteSuccess = false;
      state.deleteFailed = true;
    },
    resetStateDeleteModal(state) {
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
  },
});

export const { actions: employeeSkillActions } = slice;

export const useEmployeeSkillSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeeSkillSaga });
  return { actions: slice.actions };
};
