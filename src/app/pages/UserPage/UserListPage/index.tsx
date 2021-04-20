import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  Form,
  Tooltip,
  Avatar,
  Collapse,
  TablePaginationConfig,
} from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteModal } from 'app/components/DeleteModal';
import { useUserspageSlice } from './slice';
import { isMobileOnly } from 'react-device-detect';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { UsersMessages } from './messages';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router';
import { SearchUsers } from './components/SearchUsers/Loadable';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { UserList } from './components/UserList/Loadable';
import { Filters, Pagination, UserProfile } from '../types';
import { useGetUserList } from './useGetUserList';
const { Panel } = Collapse;

export const Users: React.FC = () => {
  const { t } = useTranslation();
  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();
  const [tablePagination, setTablePagination] = useState<Pagination>({
    current: 1,
    pageSize: 4,
    total: 0,
    totalPage: 0,
    pageSizeOptions: ['2', '3', '4', '6'],
    showSizeChanger: true,
  });
  const [tableFilters, setTableFilters] = useState<Filters>({
    email: null,
    first_name: null,
    last_name: null,
    phone: null,
  });
  const { users, loading, resPagination } = useGetUserList(tablePagination);
  const [tableSort, setTableSort] = useState({});
  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [isMore, setIsMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserProfile[]>([]);

  const [searchForm] = Form.useForm();
  const history = useHistory();

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    const filterChanges = !isEqual(filters, tableFilters);
    const sortChanges = !isEqual(sorter, tableSort);
    if (filterChanges || sortChanges) {
      setTableFilters(filters);
      setTableSort(sorter);
    }
    if (!filterChanges && !sortChanges) {
      setTablePagination({ ...pagination });
    }
  };

  useEffect(() => {
    setUserList(prev => prev.concat(users));
  }, [users]);

  useEffect(() => {
    const handleLoadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement?.scrollHeight
      ) {
        if (moreLoading) {
          if (resPagination.total !== userList.length) {
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
  }, [isMore, moreLoading, resPagination.total, tablePagination, userList]);

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${t(
            UsersMessages.filterInputPlaceholder(),
          )} ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t(UsersMessages.filterSearchButton())}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t(UsersMessages.filterResetButton())}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            {t(UsersMessages.filterFilterButton())}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    filtered: true,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (
    selectedKeys: React.SetStateAction<string>[],
    confirm: () => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const totalSearch = () => {
    const values = searchForm.getFieldsValue();
    dispatch(actions.searchUsers(values));
  };

  const resetTotalSearch = () => {
    searchForm.resetFields();
    setTablePagination({ ...tablePagination, current: 1 });
  };

  const columns = [
    {
      title: t(UsersMessages.listAvatarTitle()),
      dataIndex: 'avatar',
      render: (text, record: UserProfile) => (
        <Avatar
          size={100}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: t(UsersMessages.listFirstNameTitle()),
      dataIndex: 'first_name',
      sorter: {
        compare: (a, b) => a.first_name.localeCompare(b.first_name),
        multiple: 2,
      },
      ...getColumnSearchProps('first_name'),
    },
    {
      title: t(UsersMessages.listLastNameTitle()),
      dataIndex: 'last_name',
      sorter: {
        compare: (a, b) => a.last_name.localeCompare(b.last_name),
        multiple: 1,
      },
      ...getColumnSearchProps('last_name'),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
    },
    {
      title: t(UsersMessages.listOptionsTitle()),
      dataIndex: 'id',
      render: (text, record: UserProfile, index: number) => {
        return (
          <>
            <Tooltip title={t(UsersMessages.listViewTooltip())}>
              <IconButton
                type="primary"
                size="large"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => {
                  history.push(`/empoyees/${text}`);
                }}
              />
            </Tooltip>
            <Tooltip title={t(UsersMessages.listEditTooltip())}>
              <IconButton
                size="large"
                shape="circle"
                icon={<EditOutlined />}
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
                size="large"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => {
                  setDeleteModal({ open: true, id: text });
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleDelete = () => {
    const userId = deleteModal.id;
    if (userId) {
      dispatch(actions.deleteUser(userId));
    }
  };

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: UserProfile[],
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  return (
    <>
      <Helmet>
        <title>{t(UsersMessages.title())}</title>
        <meta name="description" content={t(UsersMessages.description())} />
      </Helmet>
      <h1>{t(UsersMessages.title())}</h1>
      <Collapse style={{ margin: '1em 0 1em 0' }}>
        <Panel header={t(UsersMessages.searchTitle())} key="1">
          <SearchUsers
            form={searchForm}
            onSearch={totalSearch}
            onReset={resetTotalSearch}
          />
        </Panel>
      </Collapse>
      {isMobileOnly ? (
        <UserList
          loading={loading}
          data={userList}
          isMore={isMore}
          moreLoading={moreLoading}
          onDelete={(id: string) => setDeleteModal({ open: true, id: id })}
        />
      ) : (
        <Row align="middle" justify="center">
          <Col span={12}>
            <Row justify="start">
              <Button
                danger
                size="large"
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  console.log('Call Deleted');
                }}
              >
                Delete {`${selectedRowKeys.length} data`}{' '}
              </Button>
            </Row>
          </Col>
          <Col span={12}>
            <HeaderButton
              pagination={resPagination}
              data={users}
              selectedRows={selectedRows}
            />
          </Col>
          <Col span={24}>
            <Table
              rowSelection={{
                selectedRowKeys,
                onChange: handleSelectedRows,
              }}
              columns={columns}
              rowKey="id"
              dataSource={users}
              pagination={resPagination}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
      )}
      <DeleteModal
        open={deleteModal.open}
        cancelText={t(UsersMessages.modalFormCancelButton())}
        deleteText={t(UsersMessages.modalFormDeleteButton())}
        content={t(UsersMessages.modalFormDeleteContent())}
        handleCancel={() => setDeleteModal({ open: false, id: '' })}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default Users;

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
