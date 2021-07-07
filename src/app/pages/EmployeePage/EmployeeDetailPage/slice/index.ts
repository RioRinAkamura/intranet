import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { userDetailsSaga } from './saga';
import { EmployeeDetailsState } from './types';

export const initialState: EmployeeDetailsState = {
  identity: '',
  loading: false,
  error: false,
};

const slice = createSlice({
  name: 'employeeDetails',
  initialState,
  reducers: {
    fetchIdentity(state) {
      state.loading = true;
    },
    fetchIdentitySuccess(state, action: PayloadAction<EmployeeDetailsState>) {
      state.identity = action.payload.identity;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    fetchIdentityFailure(state) {
      state.error = true;
      state.loading = false;
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
