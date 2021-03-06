import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { models } from '@hdwebsoft/intranet-api-sdk';
import { Col, Form, Popover, Row, Switch, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { PrivateRoute } from 'app/components/Auth/Route';
import { Avatar } from 'app/components/Avatar/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button, { IconButton } from 'app/components/Button';
import { CardLayout } from 'app/components/CardLayout';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { DeleteModal } from 'app/components/DeleteModal';
import PageTitle from 'app/components/PageTitle';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { TotalSearchForm } from 'app/components/TotalSearchForm/Loadable';
import { parse, stringify } from 'query-string';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Switch as SwitchRoute } from 'react-router-dom';
import styled from 'styled-components/macro';
import { RootState } from 'types';
import { api } from 'utils/api';
import { phoneFormat } from 'utils/phoneFormat';
import { PrivatePath } from 'utils/url.const';
import { HeaderButtons } from './HeaderButtons/HeaderButtons';
import { UsersMessages } from './message';
import { useUsersManagePageSlice } from './slice';
import { selectManageUserState, selectParams } from './slice/selectors';
import { TablePagination, useHandleDataTable } from './useHandleDataTable';
import { UserManageDetailPage } from './UserDetailPage/Loadable';

type User = models.user.User;

const ManageUserPage: React.FC = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Users');
  }, [setBreadCrumb]);
  const { notify } = useNotify();
  const { actions } = useUsersManagePageSlice();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [idUserDelete, setIdUserDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalMultiDeleteVisible, setIsMultiDeleteVisible] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User>();
  const [textCopy, setTextCopy] = useState(false);
  const [searchForm] = Form.useForm();
  const deleteModalState = useSelector(
    (state: RootState) => state.usersmanagepage,
  );
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;

  // selectors
  const userListState = useSelector(selectManageUserState);
  const params = useSelector(selectParams);

  const urlParams = parse(location.search, {
    sort: false,
  });

  const { setSearchText, resetSearch } = useHandleDataTable(
    userListState,
    actions,
  );

  const fetchUsers = useCallback(() => {
    dispatch(actions.fetchUsers({ params: params }));
  }, [actions, dispatch, params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (deleteSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete Success',
        duration: 2,
      });
    } else if (deleteFailed) {
      notify({
        type: ToastMessageType.Error,
        message: deleteModalState?.errorMessage,
        duration: 2,
      });
    }
  }, [deleteFailed, deleteModalState, deleteSuccess, notify]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelMultidelete = () => {
    setIsMultiDeleteVisible(false);
  };

  // modal
  const handleConfirmDelete = () => {
    dispatch(actions.deleteUser(idUserDelete));
    setIsModalVisible(false);

    setTimeout(() => {
      fetchUsers();
    }, 1000);
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  const totalSearch = () => {
    const values = searchForm.getFieldValue('search');
    setSearchText(values);
  };
  const resetTotalSearch = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  const descriptionDelete = (
    <p>
      You're about to permanently delete your employee{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied!' : 'Click to copy!'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        <strong
          id="deletedEmail"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            let copyText = document.getElementById('deletedEmail')?.innerText;
            if (copyText) {
              navigator.clipboard.writeText(copyText);
              setTextCopy(true);
            }
          }}
        >{`${deleteUser?.email}`}</strong>
      </Tooltip>
      . This will also delete any references to your employee.
    </p>
  );

  const moreButton = (text: string, record: User) => (
    <>
      <Tooltip title={'Detail'}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`${PrivatePath.USERS}/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title={'Edit'}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: `${PrivatePath.USERS}/${text}`,
              state: { edit: true },
            });
          }}
        />
      </Tooltip>
      <Tooltip title={'Delete'}>
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setIdUserDelete(text);
            setDeleteUser(record);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnProps<User>[] = [
    {
      dataIndex: 'avatar',
      width: 60,
      align: 'center',
      className: 'avatar',
      render: (text, record: User) => (
        <Avatar
          size={40}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
          name={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      width: 100,
      align: 'left',
      render: (text, record: User) => text,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      width: 100,
      align: 'left',
      render: (text, record: User) => text,
    },
    {
      title: 'Username',
      ellipsis: true,
      dataIndex: 'username',
      width: 210,
      align: 'left',
      render: (text, record: User) => text,
    },
    {
      title: 'Email',
      ellipsis: true,
      dataIndex: 'email',
      width: 210,
      align: 'left',
      render: (text, record: User) => text,
    },

    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 130,
      align: 'left',
      render: (text, record: User) => phoneFormat(text),
    },
    {
      title: 'Enable',
      dataIndex: 'is_active',
      width: 80,
      align: 'center',
      render: (status: boolean, record: User) => (
        <Switch
          checked={status}
          onChange={checked => handleEnableUser(record, checked)}
        />
      ),
    },
    {
      title: <ActionIcon />,
      fixed: 'right',
      dataIndex: 'id',
      width: 40,
      align: 'center',
      render: (id, record: User) => (
        <>
          <Popover content={() => moreButton(id, record)} placement="bottom">
            <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
          </Popover>
        </>
      ),
    },
  ];

  // selected rows
  const handleSelectedRows = (selectedRowKeys: Key[], selectedRows: User[]) => {
    dispatch(actions.setSelectedRows({ selectedRowKeys, selectedRows }));
  };

  // pagination
  const setPagination = (pagination: TablePagination) => {
    history.replace({
      search: stringify(
        {
          ...urlParams,
          page: pagination.current,
          limit: pagination.pageSize,
        },
        // { sort: false },
      ),
    });
    dispatch(actions.setPagination(pagination));
  };

  // enable
  const handleEnableUser = (record: User, checked: boolean) => {
    const updatedUser = {
      id: record.id,
      is_active: checked,
    };
    dispatch(actions.updateUser({ user: updatedUser }));
  };

  const handleRemoveMultiUser = async arrId => {
    try {
      const arrPromise = await arrId.map((id: string) => {
        return api.user.deleteUser(id);
      });
      await Promise.all(arrPromise);
      dispatch(actions.deleteUserSuccess());
      setIsMultiDeleteVisible(false);
      dispatch(
        actions.setSelectedRows({ selectedRowKeys: [], selectedRows: [] }),
      );
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(actions.resetStateDeleteModal());
      setIsMultiDeleteVisible(false);
      fetchUsers();
    }
  };

  return (
    <>
      <PageTitle title="User List">
        <TotalSearchForm
          form={searchForm}
          value={userListState.params.search}
          loading={userListState.loading ? true : false}
          messageTrans={UsersMessages}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
        />
      </PageTitle>
      <Wrapper>
        <Row>
          <Col span={8} style={{ marginBottom: '12px' }}>
            <Row justify="start" align="middle" style={{ height: '100%' }}>
              {userListState.selectedRowKeys &&
                userListState.selectedRowKeys.length > 0 && (
                  <Button
                    danger
                    type="primary"
                    size="middle"
                    disabled={
                      !userListState?.selectedRowKeys?.length ||
                      userListState?.selectedRowKeys?.length === 0
                    }
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setIsMultiDeleteVisible(true);
                      // handleRemoveMultiUser(userListState?.selectedRowKeys);
                    }}
                  />
                )}
              <span style={{ marginLeft: '12px' }}>
                Total: {userListState.pagination?.total}
              </span>
            </Row>
          </Col>
          <Col span={16}>
            <HeaderButtons />
          </Col>

          <Col span={24}>
            <Table
              rowSelection={{
                columnWidth: 20,
                selectedRowKeys: userListState.selectedRowKeys,
                onChange: handleSelectedRows,
              }}
              rowKey={'id'}
              dataSource={userListState.users}
              loading={userListState.loading}
              columns={columns}
              pagination={{
                ...userListState.pagination,
                onChange: (page: number, pageSize?: number) => {
                  setPagination({ current: page, pageSize });
                },
                showTotal: (total, range) => (
                  <div>
                    Showing{' '}
                    <span>
                      {range[0]}-{range[1]}
                    </span>{' '}
                    of {total} items
                  </div>
                ),
                pageSizeOptions: ['10', '20', '50', '100'],
                showSizeChanger: true,
              }}
            />
          </Col>
        </Row>
        <DeleteConfirmModal
          visible={isModalVisible}
          handleOk={handleConfirmDelete}
          handleCancel={handleCancelDeleteModal}
          title={`Remove ${deleteUser?.first_name} ${deleteUser?.last_name}`}
          description={descriptionDelete}
          answer={`${deleteUser?.email}`}
        />
        <DeleteModal
          open={isModalMultiDeleteVisible}
          handleDelete={() =>
            handleRemoveMultiUser(userListState?.selectedRowKeys)
          }
          handleCancel={handleCancelMultidelete}
          content="Are you sure you want to delete this information?"
        />
        ;
      </Wrapper>
    </>
  );
};

export const UserPage: React.FC = () => {
  return (
    <SwitchRoute>
      <PrivateRoute exact path={PrivatePath.USERS} component={ManageUserPage} />
      <PrivateRoute
        path={PrivatePath.USERS_CREATE}
        component={UserManageDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.USERS_ID}
        component={UserManageDetailPage}
      />
    </SwitchRoute>
  );
};

const Wrapper = styled(CardLayout)``;
