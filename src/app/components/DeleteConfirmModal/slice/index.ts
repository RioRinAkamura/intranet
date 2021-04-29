import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Saga } from './saga';
import { DeleteConfirmState } from './types';

export const initialState: DeleteConfirmState = {
  loading: false,
  isDeleteModalVisible: false,
  deleteSuccess: false,
  deleteFailed: false,
  title: undefined,
  description: undefined,
  answer: undefined,
};

const slice = createSlice({
  name: 'deleteConfirmModal',
  initialState,
  reducers: {
    deleteEmployee(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    showModalDeleteConfirm(
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        answer: string;
      }>,
    ) {
      state.isDeleteModalVisible = true;
      const { title, description, answer } = action.payload;
      state.title = title || state.title;
      state.description = description || state.description;
      state.answer = answer || state.answer;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    resetModalDeleteState(state) {
      state.isDeleteModalVisible = false;
      state.loading = false;
      state.title = undefined;
      state.description = undefined;
      state.answer = undefined;
      state.deleteSuccess = false;
      state.deleteFailed = false;
    },
    deleteSuccess(state) {
      state.isDeleteModalVisible = false;
      state.loading = false;
      state.title = undefined;
      state.description = undefined;
      state.answer = undefined;
      state.deleteSuccess = true;
      state.deleteFailed = false;
    },
    deleteFailed(state) {
      state.isDeleteModalVisible = false;
      state.loading = false;
      state.title = undefined;
      state.description = undefined;
      state.answer = undefined;
      state.deleteFailed = true;
      state.deleteSuccess = false;
    },
  },
});

export const { actions: deleteModalActions } = slice;

export const useDeleteModalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: Saga });
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
