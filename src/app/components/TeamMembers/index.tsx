import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Member } from './components/Member';
import { useLocation, useHistory } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import { parse, stringify } from 'query-string';
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
  const location = useLocation();
  const urlParams = parse(location.search, {
    sort: false,
  });

  const { members, projId, callback } = props;

  const handlevisibleModal = () => {
    history.replace({
      search: stringify(
        {
          ...urlParams,
          projMember: projId,
        },
        { sort: false },
      ),
    });

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
