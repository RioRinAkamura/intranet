import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BadgeList } from '../BadgeList';
import { NavList } from '../NavList';
import { NavItem } from '../NavList/NavItem';
import { Logo } from '../Sidebar/Logo';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const HeaderAdmin: React.FC<Props> = ({ collapsed, onCollapse }) => {
  return (
    <>
      <Wrapper>
        <PageWrapper>
          <div style={{ display: 'flex' }}>
            <IconToggle>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: 'trigger',
                  onClick: () => {
                    onCollapse(collapsed);
                  },
                },
              )}
            </IconToggle>
            <NavList>
              <NavItem>
                <Link to="/">Dashboard</Link>
              </NavItem>
              <NavItem>
                <Link to="/projects">Projects</Link>
              </NavItem>
              <NavItem>
                <Link to="/employees">Employees</Link>
              </NavItem>
              <NavItem>
                <Link to="/users">Users</Link>
              </NavItem>
              <NavItem>
                <Link to="/devices">Devices</Link>
              </NavItem>
            </NavList>
          </div>
          <LogoHeader>
            <Logo />
          </LogoHeader>

          <BadgeList />
        </PageWrapper>

        <SubHeader>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>
              {window.location.pathname.substr(1)}
            </Breadcrumb.Item>
          </Breadcrumb>
        </SubHeader>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.header`
  box-shadow: 0 2px 2px 0 rgba(60, 75, 100, 0.14);
  background-color: #fff;
  color: #000;
  width: 100%;
  position: sticky;
  z-index: 10;
  top: 0;
  left: 0;
`;

const LogoHeader = styled.div`
  width: 250px;
  display: none;

  @media screen and (max-width: 756px) {
    display: block;
  }

  @media screen and (max-width: 480px) {
    flex: 1;
  } ;
`;

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;
`;

const PageWrapper = styled.div`
  margin-bottom: -1px;
  border-bottom: 1px solid #d8dbe0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconToggle = styled.div`
  .trigger {
    padding: 0 24px;
    font-size: 18px;
    line-height: 64px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
  }

  .site-layout .site-layout-background {
    background: #fff;
  }
`;

export default HeaderAdmin;
