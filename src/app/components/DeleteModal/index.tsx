import { Button, Modal } from 'antd';
import React from 'react';

interface Props {
  open: boolean;
  cancelText?: string;
  deleteText?: string;
  content: string;
  loading?: boolean;
  handleDelete: () => void;
  handleCancel: () => void;
}

export const DeleteModal = React.memo((props: Props) => {
  const {
    open,
    cancelText,
    deleteText,
    content,
    loading,
    handleDelete,
    handleCancel,
  } = props;

  return (
    <Modal
      visible={open}
      title="Confirmation"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" size="large" shape="round" onClick={handleCancel}>
          {cancelText || 'Cancel'}
        </Button>,
        <Button
          type="primary"
          key="index"
          size="large"
          danger
          shape="round"
          onClick={handleDelete}
          loading={loading}
        >
          {deleteText || 'Delete'}
        </Button>,
      ]}
    >
      {content}
    </Modal>
  );
});
