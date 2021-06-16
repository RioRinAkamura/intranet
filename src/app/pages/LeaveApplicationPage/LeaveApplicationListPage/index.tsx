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
import React, { Key, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { Messages } from './messages';
import { Helmet } from 'react-helmet-async';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { useHandleDataTable } from './useHandleDataTable';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { useLeaveApplicationPageSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectState, selectIsFilter, selectParams } from './slice/selectors';
import { PageTitle } from 'app/components/PageTitle';
import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useTableConfig } from 'utils/tableConfig';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import { DeleteModal } from 'app/components/DeleteModal';

type EmployeeLeave = models.hr.EmployeeLeave;

export const LeaveApplications: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { notify } = useNotify();
  const [searchForm] = Form.useForm();
  const [IdDelete, setIdDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const deleteModalState = useSelector(
    (state: RootState) => state.leaveApplication,
  );
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const { actions } = useLeaveApplicationPageSlice();

  const dispatch = useDispatch();

  const params = useSelector(selectParams);
  const isFilter = useSelector(selectIsFilter);
  const state = useSelector(selectState);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(state, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchSelectProps,
  } = useTableConfig(state, Messages, setFilterText);

  const fetchList = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchList({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

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
        actions.delete({ IdDelete: ids[0], ids: state.selectedRowKeys }),
      );
    } else {
      await dispatch(actions.delete({ IdDelete }));
    }

    await dispatch(actions.fetchList({ params: params }));
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
    selectedRows: EmployeeLeave[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const moreButton = (text: string, record: EmployeeLeave) => (
    <>
      <Tooltip title={t(Messages.listViewTooltip())}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`/leave_applications/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title={t(Messages.listEditTooltip())}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: '/leave_applications/' + text,
              state: { edit: true },
            });
          }}
        />
      </Tooltip>
      <Tooltip title={t(Messages.listDeleteTooltip())}>
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setIdDelete(text);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnProps<EmployeeLeave>[] = [
    {
      title: 'Employee Name',
      dataIndex: 'employee_name',
      width: 75,
      fixed: 'left',
      ...getColumnSorterProps('employee_name', 1),
      ...getColumnSearchInputProps(['employee_name']),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 100,
      ...getColumnSorterProps('title', 1),
      ...getColumnSearchInputProps(['title']),
    },
    {
      title: 'Status',
      dataIndex: 'approval_status',
      width: 65,
      ...getColumnSorterProps('approval_status', 5),
      ...getColumnSearchSelectProps(
        'approval_status',
        [
          { label: 'Pending', value: 'PENDING' },
          { label: 'Approved', value: 'APPROVED' },
        ],
        'Please choose status',
      ),
    },
    {
      title: 'Working Type',
      dataIndex: 'working_type',
      width: 75,
      ...getColumnSorterProps('working_type', 6),
      ...getColumnSearchSelectProps(
        'working_type',
        [
          { label: 'Off', value: 'Off' },
          { label: 'Remote', value: 'Remote' },
        ],
        'Choose working type',
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      width: 55,
      ...getColumnSorterProps('start_date', 7),
      ...getColumnSearchInputProps(['start_date'], 0, 'date'),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      width: 55,
      ...getColumnSorterProps('end_date', 8),
      ...getColumnSearchInputProps(['end_date'], 0, 'date'),
    },
    {
      title: t(Messages.listOptionsTitle()),
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: EmployeeLeave, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(text, record)}
              placement="bottom"
            >
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t(Messages.title())}</title>
        <meta name="description" content={t(Messages.description())} />
      </Helmet>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>{t(Messages.title())}</PageTitle>
          </Col>
          <Col sm={8} xs={24}>
            <TotalSearchForm
              form={searchForm}
              value={state.params.search}
              loading={state.loading ? true : false}
              messageTrans={Messages}
              onSearch={totalSearch}
              onReset={resetTotalSearch}
            />
          </Col>
        </Row>
      </Wrapper>

      <Wrapper>
        <Row align="middle" justify="center">
          <Col span={8}>
            <Row justify="start">
              {state.selectedRowKeys && state.selectedRowKeys.length > 0 && (
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
              )}
            </Row>
          </Col>
          <Col span={16}>
            <Row justify="end">
              <Button
                style={{ marginBottom: 10 }}
                size="large"
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
            </TableWrapper>
          </Col>
        </Row>
      </Wrapper>
      <DeleteModal
        open={isModalVisible}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
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
