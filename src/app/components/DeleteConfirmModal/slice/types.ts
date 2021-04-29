/* --- STATE --- */
export interface DeleteConfirmState {
  loading: boolean;
  isDeleteModalVisible: boolean;
  title?: string;
  description?: string;
  answer?: string;
  deleteSuccess: boolean;
  deleteFailed: boolean;
}
