import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Member } from './components/Member';
import { useHistory } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
interface MemberType {
  allocation: number;
  project_role: string;
  employee: {
    id: string;
    avatar?: string;
    first_name: string;
    last_name: string;
  };
}
interface TeamMembersProps {
  members?: Array<MemberType>;
  projId: string;
  callback: (members) => void;
}

export const TeamMembers = memo((props: TeamMembersProps) => {
  const history = useHistory();

  const { members, projId, callback } = props;

  const handlevisibleModal = () => {
    history.push(`projects/${projId}/members`);

    callback(members);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {/* <TeamMemberModal
        handleOk={handleOk}
        handleCancel={handleCancel}
        visibility={visible}
        members={members}
        projId={projId}
      /> */}
      <MembersWrapper>
        {members &&
          members.map(member => {
            return <Member member={member} />;
          })}
      </MembersWrapper>

      {/* <Button onClick={() => setVisible(true)} type="primary">
        Manage
      </Button> */}
      {/* <SettingOutlined onClick={() => setVisible(true)} /> */}
      <SettingOutlined onClick={handlevisibleModal} />
    </div>
  );
});

const MembersWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  width: 80%;
`;
