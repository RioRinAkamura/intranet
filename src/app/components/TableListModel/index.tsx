import { Row, Col, Popover, Table, TablePaginationConfig, Tooltip } from 'antd';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import React, { useCallback, useEffect, useState } from 'react';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { initialState, useTableSlice } from './slice';
import { useHandleDataTable } from './useHandleDataTable';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteModal } from 'app/components/DeleteModal';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { RootStateKeyType } from 'utils/types/injector-typings';
import Button, { IconButton } from 'app/components/Button';

interface Props {
  columns: any;
  model?: RootStateKeyType;
  handleOnClickViewButton?: (id?: string) => void;
  handleOnClickEditButton?: (id?: string) => void;
}

const TableListModel: React.FC<Props> = ({
  columns,
  model = 'table',
  handleOnClickViewButton = () => {},
  handleOnClickEditButton = () => {},
}) => {
  const history = useHistory();

  const { actions } = useTableSlice(model);
  const state = useSelector(
    (state: RootState) => state[`${model}`] || initialState,
  );

  const { params, reload, loading } = state;

  const deleteModalState = useSelector((state: RootState) => state.table);

  const [selectedId, setSelectedId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteMulti, setIsDeleteMulti] = useState(false);

  const dispatch = useDispatch();
  const { notify } = useNotify();

  const { setSelectedRows, setOrdering, setPagination } = useHandleDataTable(
    state,
    actions,
  );

  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;

  const fetchList = useCallback(() => {
    if (reload && !loading) {
      dispatch(actions.fetchList({ params: params, model }));
    }
  }, [actions, dispatch, reload, params, model, loading]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalVisible(false);
    setIsDeleteMulti(false);
    const ids = state.selectedRowKeys || [];
    if (isDeleteMulti && ids.length) {
      await dispatch(
        actions.delete({ id: ids[0], ids: state.selectedRowKeys, model }),
      );
    } else {
      await dispatch(actions.delete({ id: selectedId, model }));
    }
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
    setIsDeleteMulti(false);
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

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  const handleSelectedRows = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const moreButton = (id: string) => (
    <>
      <Tooltip title="View">
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleOnClickViewButton(id)}
        />
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleOnClickEditButton(id)}
        />
      </Tooltip>
      <Tooltip title="Remove">
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setSelectedId(id);
          }}
        />
      </Tooltip>
    </>
  );

  const actionButtons = {
    title: 'Actions',
    dataIndex: 'id',
    width: 45,
    fixed: 'right',
    render: (text: string) => {
      return (
        <>
          <Popover content={() => moreButton(text)} placement="bottom">
            <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
          </Popover>
        </>
      );
    },
  };

  if (columns.length && !columns.find(item => item.dataIndex === 'id')) {
    columns.push(actionButtons);
  }

  return (
    <Row align="middle" justify="center">
      <Col span={8}>
        <Row justify="start">
          {state.selectedRowKeys && state.selectedRowKeys.length > 0 && (
            <Button
              danger
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
          )}
        </Row>
      </Col>
      <Col span={16}>
        <Row justify="end">
          <Button
            style={{ marginBottom: 10 }}
            type="primary"
            onClick={() => history.push('/leave_applications/create')}
            icon={<UserAddOutlined />}
          >
            Create leave application
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
            pagination={{
              ...state.pagination,
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
            loading={state.loading}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
          <DeleteModal
            open={isModalVisible}
            handleDelete={handleConfirmDelete}
            handleCancel={handleCancelDeleteModal}
            content="Are you sure you want to delete this information?"
          />
        </TableWrapper>
      </Col>
    </Row>
  );
};

const TableWrapper = styled.div``;

export default TableListModel;
