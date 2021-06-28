import { Helmet } from 'react-helmet-async';
import React, { Key, useCallback, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  LaptopOutlined,
} from '@ant-design/icons';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import {
  Button,
  Col,
  Row,
  Table,
  Form,
  TablePaginationConfig,
  Tooltip,
  Popover,
} from 'antd';
import { PageTitle } from 'app/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { DeleteModal } from 'app/components/DeleteModal';
import { useHandleDataTable } from './useHandleDataTable';
import { useDeviceHistoryPage } from './slice';
import { selectState, selectIsFilter, selectParams } from './slice/selectors';

interface DeviceHistory {
  user: string;
  employee: string;
  note: string;
}

export const DeviceHistory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const { actions } = useDeviceHistoryPage();
  const state = useSelector(selectState);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(state, actions);

  const history = useHistory();

  const moreButton = (text: string, record: any) => (
    <>
      <Tooltip title="Detail">
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`/devices/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: '/devices/' + text,
              state: { edit: true },
            });
          }}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          // onClick={() => {
          //   showDeleteModal();
          //   setSelectedId(text);
          // }}
        />
      </Tooltip>
    </>
  );

  const handleConfirmDelete = () => {};

  const handleCancelDelete = () => {};

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: DeviceHistory[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const columns: ColumnProps<DeviceHistory>[] = [
    {
      title: 'User',
      dataIndex: 'user',
      width: 130,
      render: text => text,
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      width: 130,
      render: text => text,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 130,
      render: text => text,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Device Manager Page</title>
        <meta name="description" content={'Device History'} />
      </Helmet>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Devices History</PageTitle>
          </Col>
          <Col sm={8} xs={24}>
            {/* <TotalSearchForm
              form={searchForm}
              value={state.params.search}
              loading={state.loading ? true : false}
              messageTrans={Messages}
              onSearch={totalSearch}
              onReset={resetTotalSearch}
            /> */}
          </Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row align="middle" justify="center">
          <Col span={8}>
            <Row justify="start">
              {/* {state.selectedRowKeys && state.selectedRowKeys.length > 0 && (
                <Button
                  danger
                  size="large"
                  disabled={
                    !state?.selectedRowKeys?.length ||
                    state?.selectedRowKeys?.length === 0
                  }
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    showDeleteModal();
                    setIsDeleteMulti(true);
                  }}
                />
              )} */}
            </Row>
          </Col>
          <Col span={16}>
            <Row justify="end">
              <Button
                style={{ marginBottom: 10 }}
                size="large"
                type="primary"
                onClick={() => history.push('/devices/create')}
                // icon={<LaptopOutlined />}
              >
                Create History
              </Button>
            </Row>
          </Col>
          <Col span={24}>
            <TableWrapper>
              <Table
                rowSelection={{
                  columnWidth: 20,
                  selectedRowKeys: state.selectedRowKeys,
                  onChange: handleSelectedRows,
                }}
                columns={columns}
                rowKey="id"
                dataSource={state.results}
                scroll={{ x: 1100 }}

                // pagination={{
                //   ...state.pagination,
                //   onChange: (page: number, pageSize?: number) => {
                //     setPagination({ current: page, pageSize });
                //   },
                //   showTotal: (total, range) => (
                //     <div>
                //       Showing{' '}
                //       <span>
                //         {range[0]}-{range[1]}
                //       </span>{' '}
                //       of {total} items
                //     </div>
                //   ),
                //   pageSizeOptions: ['10', '20', '50', '100'],
                //   showSizeChanger: true,
                // }}
                // loading={state.loading}
                // onChange={handleTableChange}
                // scroll={{ x: 1200 }}
              />
            </TableWrapper>
          </Col>
        </Row>
      </Wrapper>
      <DeleteModal
        open={isModalVisible}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        content="Are you sure you want to delete this information?"
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

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
`;

const TableWrapper = styled.div`
  .avatar {
    padding: 1em 0;
  }

  .ant-pagination-options {
    order: -1;
    margin-right: 1em;
    margin-left: 0;
  }

  .ant-pagination-total-text {
    margin-inline-end: auto;
    span {
      color: blue;
    }
  }

  .totalAllocated {
    white-space: break-spaces;
  }
`;
