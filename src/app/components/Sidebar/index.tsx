import {
  AppstoreOutlined,
  ContainerOutlined,
  MailOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: React.FC<Props> = ({ collapsed, onCollapse }) => {
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => onCollapse(collapsed)}
      breakpoint="lg"
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
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideBar;
