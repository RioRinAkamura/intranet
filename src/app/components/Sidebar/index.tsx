import {
  AppstoreOutlined,
  ContainerOutlined,
  MailOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Drawer, Layout, Menu } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: React.FC<Props> = ({ collapsed, onCollapse }) => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const [isSidebar, setIsSideBar] = React.useState(isMobile);
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
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link to="/employees">Employess</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />}>
              Option 3
            </Menu.Item>
            <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
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
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link to="/employees">Employess</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />}>
              Option 3
            </Menu.Item>
            <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
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
