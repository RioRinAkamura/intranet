import React from 'react';
import { Badge, Dropdown, Menu, Button } from 'antd';
import styled from 'styled-components';
import { BellOutlined } from '@ant-design/icons';
import { ToastMessageType, useNotify } from '../ToastNotification';
import { useHistory } from 'react-router';
import { useLogout } from '../Auth/useLogout';
import { ChangePasswordModal } from '../ChangePasswordModal';
import {
  useChangePassword,
  ChangePasswordPayload,
} from '../ChangePasswordModal/useChangePassword';
import { useDeleteConfirmModal } from '../DeleteConfirmModal/useDeleteConfirmModal';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export function Badges() {
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

  const {
    showModalDeleteConfirm,
    deleteModalState,
    resetModalDeleteState,
  } = useDeleteConfirmModal();
  const isDeleteModalVisible = deleteModalState?.isDeleteModalVisible;

  const showModalDelete = () => {
    showModalDeleteConfirm({ title: 'alo' });
  };

  const showModalDelete2 = () => {
    showModalDeleteConfirm({
      description: '43256',
      title: 'phuong',
      answer: '12345',
    });
  };

  const handleCancelDeleteModal = () => {
    resetModalDeleteState();
  };
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
          <a href="https://www.antgroup.com">Profile</a>
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
              <img
                src="https://coreui.io/demo/3.4.0/assets/img/avatars/6.jpg"
                alt=""
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
      <Button type="primary" onClick={showModalDelete}>
        Open
      </Button>
      <Button type="primary" onClick={showModalDelete2}>
        Open2
      </Button>
      <DeleteConfirmModal
        isDeleteModalVisible={isDeleteModalVisible}
        handleCancel={handleCancelDeleteModal}
      />
    </Wrapper>
  );
}

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
  img {
    border-radius: 50%;
    width: 2rem;
  }
`;
