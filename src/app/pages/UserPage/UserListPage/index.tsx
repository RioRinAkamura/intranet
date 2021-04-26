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
  Tag,
} from 'antd';
import React, { Key, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteModal } from 'app/components/DeleteModal';
import { isMobileOnly } from 'react-device-detect';
import { isArray, isEmpty, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { UsersMessages } from './messages';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router';
import { SearchUsers } from './components/SearchUsers/Loadable';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { UserList } from './components/UserList/Loadable';
import { Filters, Pagination, ParamsPayload } from '../types';
import { useGetUserList } from './useGetUserList';
import { parse, stringify } from 'query-string';
import { ColumnProps } from 'antd/lib/table';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

const { Panel } = Collapse;
type Employee = models.hr.Employee;

export const Users: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const urlParams: ParamsPayload = parse(location.search, {
    sort: false,
    parseNumbers: true,
  });
  const [tablePagination, setTablePagination] = useState<Pagination>({
    current: 1,
    pageSize: 20,
    total: 0,
    totalPage: 0,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
  });
  const [tableFilters, setTableFilters] = useState<Filters>({
    email: null,
    first_name: null,
    last_name: null,
    phone: null,
    code: null,
  });
  const [tableSort, setTableSort] = useState({});
  const { users, loading, resPagination } = useGetUserList(
    tablePagination,
    urlParams,
  );
  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<Employee[]>([]);
  const [isMore, setIsMore] = useState(true);
  const [searchText, setSearchText] = useState({});
  const [searchedColumn, setSearchedColumn] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Employee[]>([]);
  const [selectedKeys, setSelectedKeys] = useState({});

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
      if (!isEmpty(sorter)) {
        if (isArray(sorter)) {
          const orderingParams = sorter.map(item => {
            if (item.order === 'ascend') {
              return '+' + item.field;
            } else if (item.order === 'descend') {
              return '-' + item.field;
            } else {
              return '';
            }
          });
          history.replace({
            search: stringify(
              {
                ...urlParams,
                ordering: orderingParams,
              },
              { arrayFormat: 'comma' },
            ),
          });
        } else {
          if (sorter.order === 'ascend') {
            history.replace({
              search: stringify({
                ...urlParams,
                ordering: '+' + sorter.field,
              }),
            });
          } else if (sorter.order === 'descend') {
            history.replace({
              search: stringify({
                ...urlParams,
                ordering: '-' + sorter.field,
              }),
            });
          } else {
            if (urlParams.ordering) {
              delete urlParams.ordering;
              history.replace({
                search: stringify({
                  ...urlParams,
                }),
              });
            }
          }
        }
      }
    }
    if (!filterChanges && !sortChanges) {
      history.replace({
        search: stringify(
          {
            ...urlParams,
            page: pagination.current,
            limit: pagination.pageSize,
          },
          { sort: false },
        ),
      });
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
    ellipsis: true,
    filterDropdown: ({ confirm }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${t(
            UsersMessages.filterInputPlaceholder(),
          )} ${dataIndex}`}
          value={selectedKeys[dataIndex]}
          onChange={e => {
            e.persist();
            setSelectedKeys(prevState => ({
              ...prevState,
              [dataIndex]: e.target.value ? e.target.value : null,
            }));
          }}
          onPressEnter={() => handleSearch(dataIndex, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(dataIndex, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            loading={loading}
          >
            {t(UsersMessages.filterSearchButton())}
          </Button>
          <Button
            onClick={() => handleReset(dataIndex, confirm)}
            size="small"
            loading={loading}
            style={{ width: 90 }}
          >
            {t(UsersMessages.filterResetButton())}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: text => {
      return searchedColumn[dataIndex] || searchForm.getFieldValue('search') ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            searchText[dataIndex],
            searchForm.getFieldValue('search'),
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const handleSearch = (dataIndex: string, confirm: () => void) => {
    setSearchText(prevState => ({
      ...prevState,
      [dataIndex]: selectedKeys[dataIndex],
    }));
    setSearchedColumn(prevState => ({
      ...prevState,
      [dataIndex]: selectedKeys[dataIndex],
    }));
    if (selectedKeys[dataIndex]) {
      history.replace({
        search: stringify(
          {
            ...urlParams,
            [dataIndex]: selectedKeys[dataIndex],
          },
          { sort: false },
        ),
      });
    } else {
      delete urlParams[dataIndex];
      history.replace({
        search: stringify(
          {
            ...urlParams,
          },
          { sort: false },
        ),
      });
    }
    confirm();
  };

  const handleReset = (dataIndex: string, confirm: () => void) => {
    setSearchText(prevState => ({
      ...prevState,
      [dataIndex]: null,
    }));
    setSearchedColumn(prevState => ({
      ...prevState,
      [dataIndex]: null,
    }));
    setSelectedKeys(prevState => ({
      ...prevState,
      [dataIndex]: null,
    }));
    delete urlParams[dataIndex];
    history.replace({
      search: stringify(
        {
          ...urlParams,
        },
        { sort: false },
      ),
    });
    confirm();
  };

  const totalSearch = () => {
    const values = searchForm.getFieldValue('search');
    history.replace({
      search: stringify({ ...urlParams, search: values }),
    });
  };

  const resetTotalSearch = () => {
    searchForm.resetFields();
    setSelectedKeys({});
    setSearchText('');
    setSearchedColumn('');
    setTableSort({});
    history.replace({
      search: '',
    });
  };

  useEffect(() => {
    if (urlParams.search) {
      searchForm.setFieldsValue({ search: urlParams.search });
    }
    if (urlParams.limit || urlParams.page) {
      setTablePagination(prevState => ({
        ...prevState,
        pageSize: urlParams.limit,
        current: urlParams.page,
      }));
    }
    if (
      urlParams.first_name ||
      urlParams.last_name ||
      urlParams.email ||
      urlParams.phone ||
      urlParams.code
    ) {
      setSelectedKeys(prevState => ({
        ...prevState,
        first_name: urlParams.first_name,
        last_name: urlParams.last_name,
        phone: urlParams.phone,
        email: urlParams.email,
        code: urlParams.code,
      }));
      setSearchText(prevState => ({
        ...prevState,
        first_name: urlParams.first_name,
        last_name: urlParams.last_name,
        phone: urlParams.phone,
        email: urlParams.email,
        code: urlParams.code,
      }));
      setSearchedColumn(prevState => ({
        ...prevState,
        first_name: urlParams.first_name,
        last_name: urlParams.last_name,
        phone: urlParams.phone,
        email: urlParams.email,
        code: urlParams.code,
      }));
    }
  }, [
    searchForm,
    urlParams.limit,
    urlParams.page,
    urlParams.search,
    urlParams.first_name,
    urlParams.last_name,
    urlParams.phone,
    urlParams.email,
    urlParams.code,
  ]);

  const columns: ColumnProps<Employee>[] = [
    {
      title: t(UsersMessages.listAvatarTitle()),
      dataIndex: 'avatar',
      width: 100,
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
      sorter: {
        multiple: 1,
      },
      defaultSortOrder: urlParams.ordering?.includes('first_name')
        ? urlParams.ordering.includes('-first_name')
          ? 'descend'
          : 'ascend'
        : null,
      ...getColumnSearchProps('first_name'),
    },
    {
      title: t(UsersMessages.listLastNameTitle()),
      dataIndex: 'last_name',
      width: 150,
      sorter: {
        multiple: 2,
      },
      defaultSortOrder: urlParams.ordering?.includes('last_name')
        ? urlParams.ordering.includes('-last_name')
          ? 'descend'
          : 'ascend'
        : null,
      ...getColumnSearchProps('last_name'),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      width: 250,
      sorter: {
        multiple: 3,
      },
      defaultSortOrder: urlParams.ordering?.includes('email')
        ? urlParams.ordering.includes('-email')
          ? 'descend'
          : 'ascend'
        : null,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      width: 170,
      sorter: {
        multiple: 4,
      },
      defaultSortOrder: urlParams.ordering?.includes('phone')
        ? urlParams.ordering.includes('-phone')
          ? 'descend'
          : 'ascend'
        : null,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 170,
      sorter: {
        multiple: 5,
      },
      defaultSortOrder: urlParams.ordering?.includes('code')
        ? urlParams.ordering.includes('-code')
          ? 'descend'
          : 'ascend'
        : null,
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 230,
      render: (text, record: Employee, index: number) => {
        return (
          <>
            {text.map(tag => {
              return (
                <Tag color="geekblue" key={tag}>
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
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
    },
    {
      title: t(UsersMessages.listOptionsTitle()),
      dataIndex: 'id',
      fixed: 'right',
      width: 120,
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
                  setDeleteModal({ open: true, id: text });
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleDelete = () => {};

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Employee[],
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
      <Collapse
        style={{ margin: '1em 0 1em 0' }}
        defaultActiveKey={urlParams.search ? ['1'] : []}
      >
        <Panel header={t(UsersMessages.searchTitle())} key="1">
          <SearchUsers
            form={searchForm}
            loading={loading}
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
              pagination={{
                ...resPagination,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: 2000 }}
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
