import { Badge } from 'antd';
import * as React from 'react';
import styled from 'styled-components/macro';
import { Badges } from './Badges';

export function BadgeList() {
  return (
    <Wrapper>
      <Badges />
    </Wrapper>
  );
}

const Wrapper = styled.ul`
  padding-right: 20px;
  margin-bottom: 0;
`;
