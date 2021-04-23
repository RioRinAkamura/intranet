import {
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  MailOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Drawer, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BadgeList } from '../BadgeList';
import { NavList } from '../NavList';
import { NavItem } from '../NavList/NavItem';
import { useNotify, ToastMessageType } from '../Notification';
import { Logo } from '../Sidebar/Logo';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const HeaderAdmin: React.FC<Props> = ({ collapsed, onCollapse }) => {
  const { notify } = useNotify();

  const openNotification = () => {
    notify({
      type: ToastMessageType.Info,
      message: 'Add User Infor',
      description: 'quang',
      placement: 'bottomLeft',
      className: 'customClassname',
      style: {
        background:
          'lightblue url("https://designshack.net/wp-content/uploads/abstract-background.jpg") no-repeat fixed center',
      },
    });
  };
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
                <Link to="/employees">Employees</Link>
              </NavItem>
              <NavItem>
                <Link to="/">Setting</Link>
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
          <NavList>
            <NavItem>
              <Icon>
                <LineChartOutlined />
              </Icon>
              <Link to="/">Dashboard</Link>
            </NavItem>

            <NavItem>
              <Link to="/employees">Employees</Link>
            </NavItem>
            <NavItem>
              <Link to="/" onClick={openNotification}>
                Setting
              </Link>
            </NavItem>
          </NavList>
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

const Icon = styled.div`
  transform: translate(-4px, -3px);
  display: inline-block;
`;

export default HeaderAdmin;
