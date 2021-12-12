import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Card, Tag } from 'antd';
import { Avatar } from 'app/components/Avatar';
import { antColours } from 'utils/types';
import { Member } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

interface TooltipProps {
  member: Member;
}

export const MemberTooltip = memo((props: TooltipProps) => {
  const { member } = props;
  const info = { ...member.member };
  return (
    <TooltipWrapper className="member-tooltip">
      <Card>
        <TooltipHeader>
          <Avatar
            src={info.avatar}
            name={info.first_name + ' ' + info.last_name}
            size={30}
          />
          <span style={{ margin: '0 10px' }}>
            {' '}
            {` ${info.first_name} ${info.last_name} `}
          </span>
          <Tag color={antColours[member.allocation]}>{member.allocation}</Tag>
        </TooltipHeader>
      </Card>
    </TooltipWrapper>
  );
});

const TooltipWrapper = styled.div`
  display: none;
  transition: 0.4s ease;
  position: absolute;
  z-index: 1000;
  top: -10px;
  left: 120%;

  .ant-card-body {
    padding: 10px;
    width: 0;
    height: 0;
  }
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
`;
