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
  });
  const [tablePagination, setTablePagination] = useState<Pagination>({
    current: 1,
    pageSize: 20,
    total: 0,
    totalPage: 0,
  });
  const [tableFilters, setTableFilters] = useState<Filters>({
    email: null,
    first_name: null,
    last_name: null,
    phone: null,
    code: null,
  });
  const [tableSort, setTableSort] = useState({});
  const { getUserListState, fetchUsers, columns } = useGetUserList();
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
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = () => {};

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Employee[],
  ) => {
    console.log(selectedRowKeys, selectedRows);
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
              pagination={getUserListState.pagination}
              data={getUserListState.users}
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
              dataSource={getUserListState.users}
              pagination={{
                ...getUserListState.pagination,
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
