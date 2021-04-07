import { Button, Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';

export const DeleteModal = props => {
  const { open, handleDelete, handleCancel } = props;

  return (
    <Modal
      visible={open}
      footer={[
        <Button size="large" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button type="primary" size="large" danger onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <P>Are you sure you want to delete it?</P>
    </Modal>
  );
};

const P = styled.p`
  font-size: large;
`;
