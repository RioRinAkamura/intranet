import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
// import { TablePagination } from '../useHandleDataTable';

import { CategoryState } from './types';
import { categoriesManagerSaga } from './saga';

export const initialState: CategoryState = {
  results: [],
  loading: false,
};

const slice = createSlice({
  name: 'CategoryManager',
  initialState,
  reducers: {
    fetchList(state, action) {
      state.loading = true;
    },
    fetchListSuccess(state, action) {
      console.log(action.payload);
      state.results = action.payload.results;

      state.loading = false;
    },

    fetchListFailure(state, action) {
      state.error = action.payload.error;
      state.loading = false;
    },
  },
});

export const { actions: categoryManageAction } = slice;

export const useDeviceCategorySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });

  useInjectSaga({ key: slice.name, saga: categoriesManagerSaga });
  return { actions: slice.actions };
};
