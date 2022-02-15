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
import { Popover, Table, Tag, Tooltip, Switch } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Avatar } from 'app/components/Avatar/Loadable';
import { IconButton } from 'app/components/Button';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { antColours, DeleteType } from 'utils/types';
import { PrivatePath } from 'utils/url.const';
import { getSelectValues } from 'utils/variable';
import moment from 'moment';
import { ActionIcon } from 'app/components/ActionIcon';
import styled from 'styled-components';
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
      width: 100,
      render: text => getSelectValues(roles, text)?.label,
    },
    {
      title: 'Employee',
      dataIndex: 'member',
      width: 150,
      render: text => (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ display: 'block', flex: 2 }}>
            <Avatar
              src={text.avatar}
              name={text.first_name + ' ' + text.last_name}
              size={30}
            />
          </span>
          <span
            style={{
              display: 'flex',
              flex: 8,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ marginLeft: '5px', display: 'block' }}>
              {text.first_name + ' ' + text.last_name}
            </span>
            <span style={{ display: 'block', lineHeight: '100%' }}>
              <LinkEmployee onClick={() => handleLinkEmployeeClick(text)} />
            </span>
          </span>
        </span>
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
      width: 60,
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
