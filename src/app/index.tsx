/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Switch,
  Route,
  BrowserRouter,
  RouteProps,
  Link,
} from 'react-router-dom';

import { GlobalStyle } from '../styles/global-styles';
import 'antd/dist/antd.css';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { PrivateRoute, PublicRoute } from './components/Auth/Route';
import config from 'config';
import { Login } from './pages/Login/Loadable';
import { Users } from './pages/UsersPage/Loadable';
import { Breadcrumb, Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { HeaderAdmin } from './components/HeaderAdmin';
import { Logos } from './pages/HomePage/Logos';

const { Header, Content, Footer, Sider } = Layout;

type AdminRouteProps = {
  component?: React.ComponentType;
} & RouteProps;

const AdminTemplate: React.FC<AdminRouteProps> = ({
  children,
}: AdminRouteProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const onCollapse = collapsed => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => onCollapse(collapsed)}
      >
        <Logos />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/users">User</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <HeaderAdmin />
        {/* <Breadcrumb>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>{window.location.hostname}</Breadcrumb.Item>
        </Breadcrumb> */}
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

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      <Switch>
        {/* <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} /> */}
        <PublicRoute
          restricted={true}
          exact
          path={config.LOGIN_PATH}
          component={Login}
        />
        <AdminTemplate>
          <PrivateRoute
            exact
            path={config.DASHBOARD_PATH}
            component={HomePage}
          />
          <PrivateRoute exact path={config.USERS_PATH} component={Users} />
        </AdminTemplate>

        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
