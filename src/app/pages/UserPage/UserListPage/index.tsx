import {
  Button,
  Col,
  Row,
  Table,
  Form,
  Collapse,
  TablePaginationConfig,
  Avatar,
  Tag,
  Tooltip,
} from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { UsersMessages } from './messages';
import { Helmet } from 'react-helmet-async';
import { SearchUsers } from './components/SearchUsers/Loadable';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { UserList } from './components/UserList/Loadable';
import { Pagination } from '../types';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { useHandleDataTable } from './useHandleDataTable';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { useUserspageSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserspage,
  selectUserspageIsFilter,
  selectUserspageParams,
} from './slice/selectors';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';

const { Panel } = Collapse;
type Employee = models.hr.Employee;

export const Users: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [tablePagination, setTablePagination] = useState<Pagination>({
    current: 1,
    pageSize: 20,
    total: 0,
    totalPage: 0,
  });
  const { notify } = useNotify();

  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<Employee[]>([]);
  const [isMore, setIsMore] = useState(true);
  const [searchForm] = Form.useForm();
  const [idUserDelete, setIdUserDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee>();
  const deleteModalState = useSelector((state: RootState) => state.userspage);
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;

  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectUserspageParams);
  const isFilter = useSelector(selectUserspageIsFilter);
  const getUserListState = useSelector(selectUserspage);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    getColumnSorterProps,
    getColumnSearchProps,
  } = useHandleDataTable(getUserListState, actions);

  const fetchUsers = React.useCallback(async () => {
    if (!isFilter) {
      dispatch(actions.fetchUsers({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    dispatch(actions.deleteUser(idUserDelete));
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

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
        message: 'Delete Failed',
        duration: 2,
      });
    }
  }, [deleteFailed, deleteModalState, deleteSuccess, notify]);

  const descriptionDelete = (
    <p>
      You're about to permanently delete your user{' '}
      <strong>{`${deleteEmployee?.email}`}</strong>. This will also delete any
      references to your user.
    </p>
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  useEffect(() => {
    setUserList(prev =>
      prev.concat(getUserListState.users ? getUserListState.users : []),
    );
  }, [getUserListState.users]);

  useEffect(() => {
    const handleLoadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement?.scrollHeight
      ) {
        if (moreLoading) {
          if (getUserListState.params?.limit !== userList.length) {
            setTablePagination({
              ...tablePagination,
              current: tablePagination.current && tablePagination.current + 1,
            });
          } else {
            setIsMore(false);
            setMoreLoading(false);
          }
        }
      }
    };
    if (isMobileOnly) {
      document.addEventListener('scroll', handleLoadMore);
      return () => {
        document.removeEventListener('scroll', handleLoadMore);
      };
    }
  }, [
    getUserListState.params.limit,
    isMore,
    moreLoading,
    tablePagination,
    userList,
  ]);

  const totalSearch = () => {
    const values = searchForm.getFieldValue('search');
    setSearchText(values);
  };

  const resetTotalSearch = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Employee[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const columns: ColumnProps<Employee>[] = [
    {
      title: t(UsersMessages.listAvatarTitle()),
      dataIndex: 'avatar',
      width: 80,
      render: (text, record: Employee) => (
        <Avatar
          size={50}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: t(UsersMessages.listFirstNameTitle()),
      dataIndex: 'first_name',
      width: 150,
      ...getColumnSorterProps('first_name', 1),
      ...getColumnSearchProps('first_name'),
    },
    {
      title: t(UsersMessages.listLastNameTitle()),
      dataIndex: 'last_name',
      width: 150,
      ...getColumnSorterProps('last_name', 2),
      ...getColumnSearchProps('last_name'),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      width: 250,
      ...getColumnSorterProps('email', 3),
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      width: 200,
      ...getColumnSorterProps('phone', 4),
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 150,
      ...getColumnSorterProps('code', 5),
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 250,
      render: (text, record: Employee, index: number) => {
        return (
          <>
            {text.map(tag => {
              return (
                <Tag style={{ margin: 5 }} color="geekblue" key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 130,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
    },
    {
      title: t(UsersMessages.listOptionsTitle()),
      dataIndex: 'id',
      width: 130,
      fixed: 'right',
      render: (text, record: Employee, index: number) => {
        return (
          <>
            <Tooltip title={t(UsersMessages.listViewTooltip())}>
              <IconButton
                type="primary"
                shape="circle"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  history.push(`/employees/${text}`);
                }}
              />
            </Tooltip>
            <Tooltip title={t(UsersMessages.listEditTooltip())}>
              <IconButton
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  history.push({
                    pathname: '/employees/' + text,
                    state: { edit: true },
                  });
                }}
              />
            </Tooltip>
            <Tooltip title={t(UsersMessages.listDeleteTooltip())}>
              <IconButton
                danger
                shape="circle"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => {
                  showDeleteModal();
                  setIdUserDelete(text);
                  setDeleteEmployee(record);
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t(UsersMessages.title())}</title>
        <meta name="description" content={t(UsersMessages.description())} />
      </Helmet>
      <h1>{t(UsersMessages.title())}</h1>
      <Collapse
        style={{ margin: '1em 0 1em 0' }}
        defaultActiveKey={getUserListState.params.search ? ['1'] : []}
      >
        <Panel header={t(UsersMessages.searchTitle())} key="1">
          <SearchUsers
            form={searchForm}
            value={getUserListState.params.search}
            loading={getUserListState.loading ? true : false}
            onSearch={totalSearch}
            onReset={resetTotalSearch}
          />
        </Panel>
      </Collapse>
      {isMobileOnly ? (
        <UserList
          loading={getUserListState.loading ? true : false}
          data={userList}
          isMore={isMore}
          moreLoading={moreLoading}
          onDelete={(id: string, user: Employee) => {
            showDeleteModal();
            setIdUserDelete(id);
            setDeleteEmployee(user);
          }}
        />
      ) : (
        <Row align="middle" justify="center">
          <Col span={12}>
            <Row justify="start">
              <Button
                danger
                size="large"
                disabled={
                  !getUserListState?.selectedRowKeys?.length ||
                  getUserListState?.selectedRowKeys?.length === 0
                }
                onClick={() => {
                  console.log('Call Deleted');
                }}
              >
                Delete {getUserListState?.selectedRowKeys?.length || 0} data
              </Button>
            </Row>
          </Col>
          <Col span={12}>
            <HeaderButton
              pagination={getUserListState.pagination}
              data={getUserListState.users}
              selectedRows={getUserListState.selectedRows}
            />
          </Col>
          <Col span={24}>
            <Table
              rowSelection={{
                selectedRowKeys: getUserListState.selectedRowKeys,
                onChange: handleSelectedRows,
              }}
              columns={columns}
              rowKey="id"
              dataSource={getUserListState.users}
              pagination={{
                ...getUserListState.pagination,
                onChange: (page: number, pageSize?: number) => {
                  setPagination({ current: page, pageSize });
                },
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                pageSizeOptions: ['10', '20', '50', '100'],
                showSizeChanger: true,
              }}
              loading={getUserListState.loading}
              onChange={handleTableChange}
              scroll={{ x: 2000 }}
            />
          </Col>
        </Row>
      )}
      <DeleteConfirmModal
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${deleteEmployee?.first_name} ${deleteEmployee?.last_name} from the team`}
        description={descriptionDelete}
        answer={`${deleteEmployee?.email}`}
      />
    </>
  );
};

const IconButton = styled(Button)`
  margin: 5px;
  span {
    position: absolute !important;
    width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
`;
