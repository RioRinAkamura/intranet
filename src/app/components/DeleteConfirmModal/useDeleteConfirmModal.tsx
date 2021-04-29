import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { DeleteConfirmState } from './slice/types';
import { useDeleteModalSlice } from './slice';

export interface DeleteModalPayload {
  title: string;
  description: string;
  answer: string;
}
export interface DeletePayload {
  id: string;
}

interface DeleteModalHook {
  deleteModalState: DeleteConfirmState | undefined;
  showModalDeleteConfirm: (params) => void;
  resetModalDeleteState: () => void;
  deleteEmployee: (id) => void;
}

export const useDeleteConfirmModal = (): DeleteModalHook => {
  const { actions } = useDeleteModalSlice();
  const dispatch = useDispatch();

  const deleteModalState = useSelector(
    (state: RootState) => state.deleteConfirmModal,
  );

  const deleteEmployee = (id: DeletePayload) => {
    dispatch(actions.deleteEmployee(id));
  };

  const showModalDeleteConfirm = (params: DeleteModalPayload) => {
    dispatch(actions.showModalDeleteConfirm(params));
  };

  const resetModalDeleteState = () => {
    dispatch(actions.resetModalDeleteState());
  };
  return {
    deleteModalState,
    showModalDeleteConfirm,
    resetModalDeleteState,
    deleteEmployee,
  };
};
