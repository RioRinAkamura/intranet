import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  Employee,
  Member,
} from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { Popover, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Avatar } from 'app/components/Avatar/Loadable';
import { IconButton } from 'app/components/Button';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { ProjectDetailMessages } from 'app/pages/ProjectPage/ProjectDetailPage/messages';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { antColours, DeleteType } from 'utils/types';
import { PrivatePath } from 'utils/url.const';

interface Props {
  projectId: string;
  dataSource: Member[];
  loading: boolean;
}

export const MemberTable = memo((props: Props) => {
  const { projectId, dataSource, loading } = props;
  const { t } = useTranslation();
  const history = useHistory();

  //state
  const [data, setData] = useState<Member[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [member, setMember] = useState<Employee>();
  const [textCopy, setTextCopy] = useState<boolean>(false);

  useEffect(() => {
    if (dataSource) {
      setData(dataSource);
    }
  }, [dataSource]);

  const showDeleteModal = record => {
    setIsModalVisible(true);
    setMember(record);
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

  const moreButton = (text: string, record: Member) => (
    <>
      <Tooltip title={'Detail'}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`${PrivatePath.EMPLOYEES}/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title={'Edit'}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: `${PrivatePath.EMPLOYEES}/${text}`,
              state: { edit: true },
            });
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
      render: text => {
        switch (text) {
          case 'PM':
            return t(ProjectDetailMessages.memberPM());
          case 'TL':
            return t(ProjectDetailMessages.memberTL());
          case 'QC':
            return t(ProjectDetailMessages.memberQC());
          case 'DEV':
            return t(ProjectDetailMessages.memberDEV());
          case 'OTHER':
            return t(ProjectDetailMessages.memberOTHER());
          default:
            return text;
        }
      },
    },

    {
      title: 'Employee',
      dataIndex: 'member',
      width: 150,
      render: text => (
        <div>
          <Avatar
            src={text.avatar}
            name={text.first_name + ' ' + text.last_name}
            size={30}
          />
          <span style={{ marginLeft: '5px ' }}>
            {text.first_name + ' ' + text.last_name}
          </span>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      width: 100,
      render: (text, record: any, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(text, record)}
              placement="bottom"
            >
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
      <Table dataSource={data} loading={loading} columns={columns} />
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
