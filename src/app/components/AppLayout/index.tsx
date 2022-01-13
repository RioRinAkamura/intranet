import { Layout } from 'antd';
import * as React from 'react';
import { RouteProps } from 'react-router';
import { useAuthState } from '../Auth/useAuthState';
import HeaderAdmin from '../HeaderAdmin';
import { LoadingIndicator } from '../LoadingIndicator';
import { LoadingWrapper } from '../LoadingWrapper';

import Sidebar from '../Sidebar';

const { Content, Footer } = Layout;

type AdminRouteProps = {
  component?: React.ComponentType;
} & RouteProps;

const AppLayout: React.FC<AdminRouteProps> = ({
  children,
}: AdminRouteProps) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const { loading } = useAuthState();
  const onCollapse = (collapsed: boolean): void => {
    setCollapsed(!collapsed);
  };
  if (loading)
    return (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    );
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
        <Footer
          style={{
            textAlign: 'center',
            borderTop: '1px solid #d8dbe0',
            padding: '13px 50px',
          }}
        >
          © 2012 - 2021 HDWEBSOFT Co., Ltd. All Rights Reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
