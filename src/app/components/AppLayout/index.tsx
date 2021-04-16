import { Layout } from 'antd';
import * as React from 'react';
import { RouteProps } from 'react-router';
import { HeaderAdmin } from '../HeaderAdmin';

import Sidebar from '../Sidebar';

const { Header, Content, Footer, Sider } = Layout;

type AdminRouteProps = {
  component?: React.ComponentType;
} & RouteProps;

const AppLayout: React.FC<AdminRouteProps> = ({
  children,
}: AdminRouteProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const onCollapse = (collapsed: boolean): void => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={onCollapse} />
      <Layout className="site-layout">
        <HeaderAdmin collapsed={collapsed} onCollapse={onCollapse} />
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © 2012 - 2021 HDWEBSOFT Co., Ltd. All Rights Reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
