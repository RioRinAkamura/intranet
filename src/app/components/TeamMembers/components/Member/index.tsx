import React, { memo } from 'react';
import { Avatar } from 'app/components/Avatar/Loadable';
import styled from 'styled-components/macro';
import { MemberTooltip } from '../MemberTooltip';
import { Member as MemberModel } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

interface MemberProps {
  member: MemberModel;
}

export const Member = memo((props: MemberProps) => {
  const {
    member: { member },
  } = props;

  return (
    <MemberWrapper>
      <AvatarWrapper>
        {member && (
          <Avatar
            size={30}
            src={member.avatar}
            name={member.first_name + ' ' + member.last_name}
          />
        )}
      </AvatarWrapper>
      <MemberTooltip member={props.member} />
    </MemberWrapper>
  );
});

const AvatarWrapper = styled.div`
  margin-right: 5px;
  margin-bottom: 5px;

  cursor: pointer;

  &:hover ~ .member-tooltip {
    display: block;

    &::before {
      content: '';
      width: 14px;
      height: 14px;
      position: absolute;
      background-color: white;
      border-left: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      left: -6px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      border-radius: 3px;
      z-index: 1;
    }

    .ant-card-body {
      width: 250px;
      height: 100%;
    }
  }
`;

const MemberWrapper = styled.div`
  position: relative;
`;
