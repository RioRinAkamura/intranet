import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Card, Tag } from 'antd';
import { Avatar } from 'app/components/Avatar';
import { antColours } from 'utils/types';

interface TooltipProps {
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

export const MemberTooltip = memo((props: TooltipProps) => {
  const { member } = props;
  const info = { ...member.employee };
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
  margin-top: 10px;
  visibility: hidden;
  opacity: 0;
  transition: 0.4s ease;
  position: absolute;
  z-index: 1000;

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
