import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import { DialogModal } from 'app/components/DialogModal';
import { AddMember } from 'app/components/TeamMembers/components/AddMember';
import { MemberTable } from 'app/components/TeamMembers/components/MemberTable';
import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useProjectDetail } from '../../useProjectDetail';
import { Member } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/project/models';
import { config } from 'config';
import moment from 'moment';
interface LocationParams {
  id: string;
}

const DATE_FORMAT = config.DATE_FORMAT;

export const Employees = memo(() => {
  const { id } = useParams<LocationParams>();
  const {
    members,
    loading,
    fetchMembers,
    addMember,
    updateMember,
  } = useProjectDetail();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editMember, setEditMember] = useState<Member>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchMembers(id);
    }
  }, [fetchMembers, id]);

  const handleAddMember = () => {
    form.validateFields().then(async values => {
      try {
        let joinedDate = values.members.joined_at;
        values.members.joined_at = joinedDate
          ? moment(joinedDate).format(DATE_FORMAT)
          : undefined;
        const response = await addMember(id, values);
        if (response) {
          setOpenModal(false);
          form.resetFields();
          fetchMembers(id);
        }
      } catch (e: any) {
        message.error(e.message);
      }
    });
  };

  const handleEditMember = () => {
    form.validateFields().then(async values => {
      try {
        delete values.members.member_id;
        if (editMember) {
          values.members.joined_at = values.members.joined_at
            ? moment(values.members.joined_at).format(DATE_FORMAT)
            : undefined;
          const memberEdit = values.members;
          const response = await updateMember(
            id,
            editMember.member.id,
            memberEdit,
          );

          if (response) {
            setOpenModal(false);
            setIsEdit(false);
            form.resetFields();
            fetchMembers(id);
          }
        }
      } catch (e: any) {
        message.error(e.message);
      }
    });
  };

  const handleCancel = () => {
    setOpenModal(false);
    setIsEdit(false);
    setEditMember(undefined);
    form.resetFields();
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
      <MemberTable
        setIsEdit={setIsEdit}
        setOpenModal={setOpenModal}
        projectId={id}
        setEditMember={setEditMember}
        dataSource={members}
        loading={loading}
      />
      <DialogModal
        isOpen={openModal}
        cancelText="Cancel"
        okText={isEdit ? 'Edit' : 'Add'}
        handleCancel={handleCancel}
        handleSubmit={isEdit ? handleEditMember : handleAddMember}
        width={600}
      >
        <AddMember
          member={editMember}
          isEdit={isEdit}
          projId={id}
          form={form}
        />
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
