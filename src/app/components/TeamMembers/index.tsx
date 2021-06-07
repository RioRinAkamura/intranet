import React, { memo, useState } from 'react';
import styled from 'styled-components/macro';
import { Member } from './components/Member';
import { Button } from 'antd';
import { TeamMemberModal } from './components/TeamMemberModal';

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
  callback: () => void;
}

export const TeamMembers = memo((props: TeamMembersProps) => {
  const [visible, setVisible] = useState(false);
  const { members, projId, callback } = props;

  const handleOk = () => {
    setVisible(false);
    callback();
  };

  const handleCancel = () => {
    setVisible(false);
    callback();
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <TeamMemberModal
        handleOk={handleOk}
        handleCancel={handleCancel}
        visibility={visible}
        members={members}
        projId={projId}
      />
      <MembersWrapper>
        {members &&
          members.map(member => {
            return <Member member={member} />;
          })}
      </MembersWrapper>

      <Button onClick={() => setVisible(true)} type="primary">
        Manage
      </Button>
    </div>
  );
});

const MembersWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  width: 80%;
`;
