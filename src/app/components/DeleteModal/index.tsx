import { Button, Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface Props {
  open: boolean;
  cancelText?: string;
  deleteText?: string;
  content: string;
  handleDelete: () => void;
  handleCancel: () => void;
}

export const DeleteModal = React.memo((props: Props) => {
  const {
    open,
    cancelText,
    deleteText,
    content,
    handleDelete,
    handleCancel,
  } = props;

  return (
    <Modal
      visible={open}
      onCancel={handleCancel}
      footer={[
        <Button size="large" key="cancel" onClick={handleCancel}>
          {cancelText || 'Cancel'}
        </Button>,
        <Button
          type="primary"
          key="index"
          size="large"
          danger
          onClick={handleDelete}
        >
          {deleteText || 'Delete'}
        </Button>,
      ]}
    >
      <P>{content}</P>
    </Modal>
  );
});

const P = styled.p`
  font-size: large;
`;
