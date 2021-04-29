import {
  Button,
  Col,
  Row,
  Table,
  Form,
  Collapse,
  TablePaginationConfig,
} from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { DeleteModal } from 'app/components/DeleteModal';
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

const { Panel } = Collapse;
type Employee = models.hr.Employee;

export const Users: React.FC = () => {
  const { t } = useTranslation();
  const [tablePagination, setTablePagination] = useState<Pagination>({
    current: 1,
    pageSize: 20,
    total: 0,
    totalPage: 0,
  });
  const {
    getUserListState,
    fetchUsers,
    columns,
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
  } = useHandleDataTable();
  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<Employee[]>([]);
  const [isMore, setIsMore] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '' });
  const [searchForm] = Form.useForm();

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
    setPagination(pagination);
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
    searchForm.resetFields();
    resetSearch();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = () => {};

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Employee[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
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
        defaultActiveKey={getUserListState?.params.search ? ['1'] : []}
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
          onDelete={(id: string) => setDeleteModal({ open: true, id: id })}
        />
      ) : (
        <Row align="middle" justify="center">
          <Col span={12}>
            <Row justify="start">
              <Button
                danger
                size="large"
                disabled={getUserListState?.selectedRowKeys?.length === 0}
                onClick={() => {
                  console.log('Call Deleted');
                }}
              >
                Delete {getUserListState?.selectedRowKeys?.length} data
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
