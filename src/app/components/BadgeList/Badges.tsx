import { BellOutlined } from '@ant-design/icons';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Badge, Dropdown, Menu } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import React, { memo } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useAuth } from '../Auth/Context';
import { useLogout } from '../Auth/useLogout';
import { ChangePasswordModal } from '../ChangePasswordModal';
import {
  ChangePasswordPayload,
  useChangePassword,
} from '../ChangePasswordModal/useChangePassword';
import { ToastMessageType, useNotify } from '../ToastNotification';

interface Props {
  user?: Employee;
}

export const Badges = memo((props: Props) => {
  const { user } = props;
  const { identity } = useAuth();
  const { notify } = useNotify();
  const history = useHistory();
  const { logout } = useLogout();
  const {
    changePasswordState,
    showModalChangePassword,
    changePassword,
    resetStateChangePassword,
  } = useChangePassword();
  const isModalVisible: boolean | undefined =
    changePasswordState?.isModalVisible;

  const showModal = () => {
    showModalChangePassword();
  };

  const handleOk = (values: ChangePasswordPayload) => {
    changePassword(values);
  };

  const handleCancel = () => {
    resetStateChangePassword();
  };

  const onClickLogout = async () => {
    await logout();
    notify({
      type: ToastMessageType.Info,
      message: ' User Logout Success ',
      duration: 2,
    });
    history.push('/login');
  };

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

  const UserMenu = () => {
    return (
      <Menu>
        <Menu.Item key="0">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => history.push(`/users/${identity?.id}`)}>Profile</a>
        </Menu.Item>
        <Menu.Item key="1">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={showModal}>Change password</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={() => onClickLogout()}>
          Logout
        </Menu.Item>
      </Menu>
    );
  };

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
        <Dropdown overlay={() => UserMenu()} trigger={['click']}>
          <a
            className="ant-dropdown-link"
            onClick={e => e.preventDefault()}
            href="/"
          >
            <UserInfo>
              <Avatar
                size={30}
                src={identity ? identity.avatar : undefined}
                alt={identity ? identity.displayName : undefined}
                name={
                  identity?.displayName ??
                  user?.first_name + ' ' + user?.last_name
                }
              />
            </UserInfo>
          </a>
        </Dropdown>
      </Item>

      <ChangePasswordModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </Wrapper>
  );
});

const Wrapper = styled.li`
  display: inline-block;
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
  width: 2rem;
  height: 2rem;
  img {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    object-fit: cover;
  }
`;
