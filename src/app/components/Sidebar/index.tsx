import { Drawer, Layout } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { Logo } from './Logo';
import { MenuItems } from './MenuItems';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: React.FC<Props> = ({ collapsed, onCollapse }) => {
  const { Sider } = Layout;
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
          <MenuItems />
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
          <MenuItems />
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
