import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LinkOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  Employee,
  Member,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Popover, Switch, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { Avatar } from 'app/components/Avatar/Loadable';
import { IconButton } from 'app/components/Button';
import CopyToClipboard from 'app/components/CopyToClipboard';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { api } from 'utils/api';
import { antColours, DeleteType } from 'utils/types';
import { PrivatePath } from 'utils/url.const';
import { getSelectValues } from 'utils/variable';

interface Props {
  projectId: string;
  dataSource: Member[];
  loading: boolean;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMember?: React.Dispatch<React.SetStateAction<Member | undefined>>;
}

export const MemberTable = memo((props: Props) => {
  const {
    projectId,
    dataSource,
    loading,
    setIsEdit,
    setOpenModal,
    setEditMember,
  } = props;
  const history = useHistory();

  //state
  const [data, setData] = useState<Member[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [member, setMember] = useState<Employee>();
  const [textCopy, setTextCopy] = useState<boolean>(false);

  // hooks
  const { roles, getRoles } = useProjectDetail();

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  useEffect(() => {
    if (dataSource) {
      setData(dataSource);
    }
  }, [dataSource]);

  const showDeleteModal = record => {
    setIsModalVisible(true);
    setMember(record);
  };

  const showEditModal = (record: Member) => {
    if (setIsEdit && setOpenModal && setEditMember) {
      setIsEdit(true);
      setOpenModal(true);
      setEditMember(record);
    }
  };

  const handleConfirmDelete = async () => {
    setIsModalVisible(false);
    try {
      if (member) {
        await api.hr.project.deleteMember(projectId, member.id);
        const newMemberList =
          data &&
          data.filter((data: Member) => {
            return data.member?.id !== member.id;
          });
        setData(newMemberList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  const handleAllocable = async (checked: boolean, record) => {
    try {
      const updatedMember = {
        ...record,
        allocable: checked,
      };
      await api.hr.project.updateMember(
        projectId,
        record.member.id,
        updatedMember,
      );
      const newMemberList = data.map(member => {
        if (member.member.id === updatedMember.member.id) {
          member = updatedMember;
        }
        return member;
      });
      setData(newMemberList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkEmployeeClick = member => {
    const win = window.open(`${PrivatePath.EMPLOYEES}/${member.id}`, '_blank');
    if (win) {
      win.focus();
    }
  };

  const moreButton = (record: Member) => (
    <>
      <Tooltip title={'Detail'}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`${PrivatePath.EMPLOYEES}/${record.member.id}`);
          }}
        />
      </Tooltip>
      <Tooltip title={'Edit'}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            showEditModal(record);
          }}
        />
      </Tooltip>
      <Tooltip title={'Delete'}>
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal(record.member);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnsType<any> = [
    {
      title: 'Allocation',
      dataIndex: 'allocation',
      width: 100,
      render: allocation => (
        <Tag color={antColours[allocation]}>{allocation}</Tag>
      ),
    },
    {
      title: 'Project Role',
      dataIndex: 'project_role',
      width: 150,
      render: text => getSelectValues(roles, text)?.label,
    },
    {
      title: 'Employee',
      dataIndex: 'member',
      width: 150,
      render: text => (
        <MemberCol>
          <div style={{ flex: 1 }}>
            <Avatar
              src={text.avatar}
              name={text.first_name + ' ' + text.last_name}
              size={30}
            />
          </div>
          <div style={{ flex: 9 }}>
            <MemberInfo>
              <div>{text.first_name + ' ' + text.last_name}</div>
              <LinkEmployee onClick={() => handleLinkEmployeeClick(text)} />
            </MemberInfo>
            <MemberInfo>
              <EmailWrap>{text.email}</EmailWrap>
              <Tooltip title="Copy email">
                <CopyToClipboard text={text.email} />
              </Tooltip>
            </MemberInfo>
          </div>
        </MemberCol>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joined_at',
      width: 100,
      render: date => (date ? moment(date).format('MM-DD-YYYY') : ''),
    },
    {
      title: 'Allocable',
      dataIndex: 'allocable',
      width: 100,
      render: (status: boolean, record) => (
        <Switch
          checked={status}
          onChange={checked => handleAllocable(checked, record)}
        />
      ),
    },
    {
      title: <ActionIcon />,
      dataIndex: '',
      width: 100,
      render: (record: Member, index: number) => {
        return (
          <>
            <Popover content={() => moreButton(record)} placement="bottom">
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  const descriptionDelete = (
    <p>
      You're about to permanently delete your team member{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied!' : 'Click to copy!'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        <strong
          id="deletedId"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (member) {
              const name = member.first_name + ' ' + member.last_name;
              navigator.clipboard.writeText(name);
              setTextCopy(true);
            }
          }}
        >{`${member?.first_name} ${member?.last_name}`}</strong>
      </Tooltip>
      . This will also delete any references to your project.
    </p>
  );

  return (
    <div>
      <Table
        dataSource={data}
        loading={loading}
        columns={columns}
        pagination={false}
      />
      <DeleteConfirmModal
        type={DeleteType.NAME}
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove Team Member`}
        description={descriptionDelete}
        answer={`${member?.first_name} ${member?.last_name}`}
      />
    </div>
  );
});

const LinkEmployee = styled(LinkOutlined)`
  /* margin-left: 12px; */
  color: #1890ff;
  cursor: pointer;
`;

const MemberCol = styled.div`
  display: flex;
  align-items: center;
`;

const MemberInfo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-left: 5px;
`;

const EmailWrap = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
