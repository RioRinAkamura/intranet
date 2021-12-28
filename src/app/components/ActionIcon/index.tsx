import { EllipsisOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

export const ActionIcon = () => {
  return <DotsAction />;
};

const DotsAction = styled(EllipsisOutlined)`
  font-size: 22px;
  margin-left: 5px;
`;
