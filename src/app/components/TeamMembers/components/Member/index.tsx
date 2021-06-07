import React, { memo } from 'react';
import { Avatar } from 'app/components/Avatar/Loadable';
import styled from 'styled-components/macro';
import { MemberTooltip } from '../MemberTooltip';

interface MemberProps {
  member: {
    allocation: number;
    project_role: string;
    employee: {
      id: string;
      avatar?: string;
      first_name: string;
      last_name: string;
    };
  };
}

export const Member = memo((props: MemberProps) => {
  const {
    member: { employee: info },
  } = props;

  return (
    <MemberWrapper>
      <AvatarWrapper>
        <Avatar
          size={30}
          src={info.avatar}
          name={info.first_name + ' ' + info.last_name}
        />
      </AvatarWrapper>
      <MemberTooltip member={props.member} />
    </MemberWrapper>
  );
});

const AvatarWrapper = styled.div`
  margin-right: 5px;
  margin-bottom: 5px;

  &:hover ~ .member-tooltip {
    opacity: 1;
    visibility: visible;

    .ant-card-body {
      width: 250px;
      height: 100%;
    }
  }
`;

const MemberWrapper = styled.div`
  position: relative;
`;
