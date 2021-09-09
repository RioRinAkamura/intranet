import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import { DialogModal } from 'app/components/DialogModal';
import { AddMember } from 'app/components/TeamMembers/components/AddMember';
import { MemberTable } from 'app/components/TeamMembers/components/MemberTable';
import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useProjectDetail } from '../../useProjectDetail';

interface LocationParams {
  id: string;
}

export const Employees = memo(() => {
  const { id } = useParams<LocationParams>();
  const { members, loading, fetchMembers, addMember } = useProjectDetail();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [addForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchMembers(id);
    }
  }, [fetchMembers, id]);

  const handleAddMember = () => {
    addForm.validateFields().then(async values => {
      try {
        const response = await addMember(id, values);
        if (response) {
          setOpenModal(false);
          addForm.resetFields();
          fetchMembers(id);
        }
      } catch (e: any) {
        message.error(e.message);
      }
    });
  };

  return (
    <Wrapper>
      <HeaderButton>
        <Button
          shape="round"
          type="primary"
          onClick={() => setOpenModal(true)}
          icon={<PlusCircleOutlined />}
          size="middle"
        >
          Add Member
        </Button>
      </HeaderButton>
      <MemberTable projectId={id} dataSource={members} loading={loading} />
      <DialogModal
        isOpen={openModal}
        cancelText="Cancel"
        okText="Add"
        handleCancel={() => {
          setOpenModal(false);
          addForm.resetFields();
        }}
        handleSubmit={handleAddMember}
      >
        <AddMember projId={id} form={addForm} />
      </DialogModal>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  background-color: #fff;
  padding: 1em;
`;

const HeaderButton = styled.div`
  float: right;
  margin-left: 1em;
  margin-bottom: 1em;
  button {
    display: flex;
    align-items: center;
  }
`;
