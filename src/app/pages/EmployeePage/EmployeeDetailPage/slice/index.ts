import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userDetailsSaga } from './saga';
import {
  EmployeeDetailsState,
  EmployeeIdentityPayload,
  EmployeeSkillPayload,
} from './types';

export const initialState: EmployeeDetailsState = {
  identity: '',
  loading: false,
  error: false,
  employeeSkills: {
    loading: false,
    error: false,
    list: [],
  },
};

const slice = createSlice({
  name: 'employeeDetails',
  initialState,
  reducers: {
    fetchIdentity(state) {
      state.loading = true;
    },
    fetchIdentitySuccess(
      state,
      action: PayloadAction<EmployeeIdentityPayload>,
    ) {
      state.identity = action.payload.identity;
      state.loading = action.payload.loading;
    },
    fetchIdentityFailure(state) {
      state.error = true;
      state.loading = false;
    },
    fetchEmployeeSkills(state, action: PayloadAction<string>) {
      state.employeeSkills.loading = true;
    },
    fetchEmployeeSkillsSuccess(
      state,
      action: PayloadAction<EmployeeSkillPayload>,
    ) {
      state.employeeSkills.list = action.payload.list;
      state.employeeSkills.loading = action.payload.loading;
    },
    fetchEmployeeSkillsFailure(state) {
      state.employeeSkills.error = true;
      state.employeeSkills.loading = false;
    },
  },
});

export const { actions: Actions } = slice;

export const useUserDetailsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userDetailsSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
