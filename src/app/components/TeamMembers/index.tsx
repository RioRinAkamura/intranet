import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Member } from './components/Member';
import { useHistory } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import { Member as MemberModel } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

interface TeamMembersProps {
  members?: Array<MemberModel>;
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
      <MembersWrapper>
        {members &&
          members.map(member => {
            return <Member key={member.id} member={member} />;
          })}
      </MembersWrapper>

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
