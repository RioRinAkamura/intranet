import { Breadcrumb } from 'antd';
import * as React from 'react';
import styled from 'styled-components/macro';
import { BadgeList } from '../BadgeList';
import { PageWrapper } from '../PageWrapper';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed) => void;
}

export const HeaderAdmin: React.FC<Props> = () => {
  return (
    <Wrapper>
      <PageWrapper>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>
            {window.location.pathname.substr(1)}
          </Breadcrumb.Item>
        </Breadcrumb>
        <BadgeList />
      </PageWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  box-shadow: 0 2px 2px 0 rgba(60, 75, 100, 0.14);
  background-color: #fff;
  color: #000;
  width: 100%;

  ${PageWrapper} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
`;
