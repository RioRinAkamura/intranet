import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useGetIdentity } from '../Auth/useGetIdentity';
import { BadgeList } from '../BadgeList';
import { NavList } from '../NavList';
import { NavItem } from '../NavList/NavItem';
import { Logo } from '../Sidebar/Logo';

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const HeaderAdmin: React.FC<Props> = ({ collapsed, onCollapse }) => {
  const { identity } = useGetIdentity();
  const userId = identity?.employee?.id;
  const { breadCrumb } = useBreadCrumbContext();

  const breadCrumbItems = breadCrumb.split('/');

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
              {identity &&
              identity?.role?.length === 1 &&
              identity?.role[0].name === 'staff' ? (
                <>
                  <Active>
                    <NavItem>
                      <NavLink exact to="/dashboard" activeClassName="active">
                        Dashboard
                      </NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink
                        to={`/employees/${userId}`}
                        activeClassName="active"
                      >
                        Employee
                      </NavLink>
                    </NavItem>
                  </Active>
                </>
              ) : (
                <>
                  <Active>
                    <NavItem>
                      <NavLink exact to="/" activeClassName="active">
                        Dashboard
                      </NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink to="/employees" activeClassName="active">
                        Employees
                      </NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink exact to="/projects">
                        Projects
                      </NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink to="/devices">Devices</NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink to="/users">Users</NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink to="/tasks">Tasks</NavLink>
                    </NavItem>
                  </Active>
                  <Active>
                    <NavItem>
                      <NavLink to="/projects-daily-reports">Timesheets</NavLink>
                    </NavItem>
                  </Active>
                </>
              )}
            </NavList>
          </div>
          <LogoHeader>
            <Logo />
          </LogoHeader>

          <BadgeList />
        </PageWrapper>

        <SubHeader>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadCrumbItems &&
              breadCrumbItems.map(
                (breadCrumItem: string, index: number, arr) => {
                  if (arr.length - 1 === index) {
                    return <Breadcrumb.Item>{breadCrumItem}</Breadcrumb.Item>;
                  } else {
                    return (
                      <Breadcrumb.Item>
                        <a href={`/${breadCrumItem.toLowerCase()}`}>
                          {breadCrumItem}
                        </a>
                      </Breadcrumb.Item>
                    );
                  }
                },
              )}
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

const Active = styled.div`
  .active {
    border-bottom: 1px solid #333;
    color: #333;
  }
`;

export default HeaderAdmin;
