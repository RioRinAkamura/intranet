import React, { memo, useState, useEffect } from 'react';
import { Modal, Tabs, Button, Form, message } from 'antd';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import { ProjectDetailMessages } from 'app/pages/ProjectPage/ProjectDetailPage/messages';
import { PrivatePath } from 'utils/url.const';
import { api } from 'utils/api';
import { Member } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/project/models';
import { MemberTable } from '../MemberTable';
import { AddMember } from '../AddMember';

interface TeamMemberProps {
  visibility: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  projId: string;
}

interface ProjectType {
  members: Array<Member>;
  name?: string;
  overview?: string;
  status?: string;
  total_member?: number;
}

const { TabPane } = Tabs;

const allocations: number[] = [2];
for (let i = 4; i <= 40; i += 4) {
  allocations.push(i);
}

export const TeamMemberModal = memo((props: TeamMemberProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDatasource] = useState<Member[]>([]);
  const [memberForm] = Form.useForm();
  const [loadingMember, setLoadingMember] = useState(false);
  const [modalWidth, setModalWidth] = useState(1000);
  const [activeKey, setActiveKey] = useState('1');
  const [members, setMembers] = useState<Member[]>([]);
  const { fetchId } = useProjectDetail();
  const { visibility, handleOk, handleCancel, projId } = props;

  useEffect(() => {
    if (members) {
      setDatasource(members);
    }
  }, [members]);

  useEffect(() => {
    if (!visibility) {
      // reset form
      memberForm.resetFields();
    }
  }, [visibility, memberForm]);

  useEffect(() => {
    if (history.location.pathname.includes('add')) {
      setActiveKey('2');
      setModalWidth(600);
    } else {
      setActiveKey('1');
      setModalWidth(1000);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    if (projId) {
      (async () => {
        try {
          setLoading(true);
          const projectRes: ProjectType = await fetchId(projId);
          setMembers(projectRes.members);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [projId, fetchId]);

  // add members

  const handleAddMember = async values => {
    try {
      setLoadingMember(true);
      if (projId) {
        const response = await api.hr.project.createMember(projId, {
          ...values.members,
          project: projId,
        });
        if (response) {
          message.success('Add member successfully');
          memberForm.resetFields();
          const employee = await api.hr.project.getMemberDetail(
            projId,
            response.member.id,
          );
          const newMember: any = {
            ...employee,
          };

          const newDs = dataSource && [
            ...dataSource,
            {
              ...newMember,
              name:
                newMember.member.first_name + ' ' + newMember.member.last_name,
              employee: newMember.member,
              ...newMember.member,
            },
          ];
          setDatasource(newDs);
          history.push(`${PrivatePath.PROJECTS}/${projId}/members`);
        }
      }
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setLoadingMember(false);
    }
  };

  const handleChangeTab = key => {
    setActiveKey(key);
    if (key === '1') {
      history.push(`${PrivatePath.PROJECTS}/${projId}/members`);
      setModalWidth(1000);
    } else {
      history.push(`${PrivatePath.PROJECTS}/${projId}/members/add`);
      setModalWidth(600);
    }
  };

  return (
    <MembersModal
      width={modalWidth}
      onOk={handleOk}
      onCancel={handleCancel}
      visible={visibility}
      footer={[
        <Button key="back" shape="round" size="large" onClick={handleCancel}>
          Close
        </Button>,
        <Button
          style={{
            display: activeKey === '1' ? 'none' : 'inline-block',
          }}
          loading={loadingMember}
          htmlType="submit"
          type="primary"
          shape="round"
          size="large"
          onClick={() => {
            memberForm.validateFields().then(values => {
              handleAddMember(values);
            });
          }}
        >
          {t(ProjectDetailMessages.buttonSubmit())}
        </Button>,
      ]}
    >
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        onChange={handleChangeTab}
      >
        <TabPane tab="Team Members" key="1">
          <MemberTable
            projectId={projId}
            dataSource={dataSource}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Add Members" key="2">
          <AddMember projId={projId} form={memberForm} />
        </TabPane>
      </Tabs>
    </MembersModal>
  );
});

const MembersModal = styled(Modal)`
  .ant-modal-body {
    max-height: 600px;
    overflow-y: scroll;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .ant-modal-body::-webkit-scrollbar {
    display: none;
  }

  .ant-pagination {
    display: none;
  }
`;
