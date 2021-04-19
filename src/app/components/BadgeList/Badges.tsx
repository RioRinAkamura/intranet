import * as React from 'react';
import { Badge, Dropdown, Menu } from 'antd';
import styled from 'styled-components';
import { BellOutlined } from '@ant-design/icons';

const notifyMenu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="https://www.aliyun.com">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

const UserMenu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">Profile</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="https://www.aliyun.com">Change password</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">Logout</Menu.Item>
  </Menu>
);

export function Badges() {
  return (
    <Wrapper>
      <Item>
        <Dropdown overlay={notifyMenu} trigger={['click']}>
          <a
            className="ant-dropdown-link"
            onClick={e => e.preventDefault()}
            href="/"
          >
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '1.2rem' }} />
            </Badge>
          </a>
        </Dropdown>
      </Item>
      <Item>
        <Dropdown overlay={UserMenu} trigger={['click']}>
          <a
            className="ant-dropdown-link"
            onClick={e => e.preventDefault()}
            href="/"
          >
            <UserInfo>
              <img
                src="https://coreui.io/demo/3.4.0/assets/img/avatars/6.jpg"
                alt=""
              />
            </UserInfo>
          </a>
        </Dropdown>
      </Item>
    </Wrapper>
  );
}

const Wrapper = styled.li`
  display: inline-block;
  margin-right: -1rem;
`;

const Item = styled.button`
  background-color: transparent;
  color: #fff;
  outline: 0;
  border: 0;
  font-size: 20px;
  margin: 0 10px;
`;

const UserInfo = styled.div`
  img {
    border-radius: 50%;
    width: 2rem;
  }
`;
