import {
  AppstoreOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Drawer, Layout, Menu } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from './Logo';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: React.FC<Props> = ({ collapsed, onCollapse }) => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const [isSidebar] = React.useState(isMobile);
  return (
    <Wrapper style={{ width: collapsed ? 80 : 200 }}>
      {isMobile ? (
        <Drawer
          visible={collapsed}
          placement="left"
          onClose={() => onCollapse(collapsed)}
          closable={false}
          bodyStyle={{ background: '#001529' }}
          width={250}
        >
          <Logo />
          <Menu
            theme="dark"
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
          >
            <Menu.Item key="/" icon={<PieChartOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/employees" icon={<TeamOutlined />}>
              <Link to="/employees">Employees</Link>
            </Menu.Item>
            <Menu.Item key="/users" icon={<UserOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>

            <SubMenu
              key="sub2"
              icon={<AppstoreOutlined />}
              title="Navigation Two"
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => onCollapse(collapsed)}
          collapsedWidth="80"
          breakpoint="lg"
          style={{ display: isSidebar ? 'none' : 'block' }}
        >
          <Logo />
          <Menu
            theme="dark"
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
          >
            <Menu.Item key="/" icon={<PieChartOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/employees" icon={<TeamOutlined />}>
              <Link to="/employees">Employees</Link>
            </Menu.Item>
            <Menu.Item key="/users" icon={<UserOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>

            <SubMenu
              key="sub2"
              icon={<AppstoreOutlined />}
              title="Navigation Two"
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </Sider>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;

  aside {
    height: 100%;
    position: fixed;
    height: 100%;
    z-index: 20;
    top: 0;
    left: 0;
  }

  @media screen and (max-width: 956px) {
    aside {
      position: fixed;
      height: 100%;
      z-index: 11;
    }
  }
`;

export default SideBar;
