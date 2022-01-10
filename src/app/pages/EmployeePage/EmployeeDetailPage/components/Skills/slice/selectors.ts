import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.employeeSkill || initialState;

export const selectEmployeeSkill = createSelector(
  [selectSlice],
  state => state,
);

export const selectEmployeeSkillIsFilter = createSelector(
  [selectSlice],
  state => state.isFilter,
);

export const selectEmployeeSkillFilterColumns = createSelector(
  [selectSlice],
  state => state.filterColumns,
);
export const selectEmployeeSkillSearchText = createSelector(
  [selectSlice],
  state => state.params.search,
);

export const selectEmployeeSkillParams = createSelector(
  [selectSlice],
  state => state.params,
);

export const selectEmployeeSkillAddSuccess = createSelector(
  [selectSlice],
  state => state.addSuccess,
);
export const selectEmployeeSkillAddFailed = createSelector(
  [selectSlice],
  state => state.addFailed,
);
export const selectEmployeeSkillEditSuccess = createSelector(
  [selectSlice],
  state => state.editSuccess,
);
export const selectEmployeeSkillEditFailed = createSelector(
  [selectSlice],
  state => state.editFailed,
);
export const selectEmployeeSkillDeleteSuccess = createSelector(
  [selectSlice],
  state => state.deleteSuccess,
);
export const selectEmployeeSkillDeleteFailed = createSelector(
  [selectSlice],
  state => state.deleteFailed,
);
