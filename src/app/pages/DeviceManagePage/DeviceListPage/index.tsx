import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Col,
  Form,
  Popover,
  Row,
  Table,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ActionIcon } from 'app/components/ActionIcon';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button, { IconButton } from 'app/components/Button';
import { CardLayout } from 'app/components/CardLayout';
import { DeleteModal } from 'app/components/DeleteModal';
import PageTitle from 'app/components/PageTitle';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { StyledLink } from 'styles/StyledCommon';
import { useTableConfig } from 'utils/tableConfig';
import { PrivatePath } from 'utils/url.const';
import { useDeviceDetail } from '../DeviceDetailPage/useDeviceDetail';
import { Messages } from './messages';
import { useDeviceManagePage } from './slice';
import { selectIsFilter, selectParams, selectState } from './slice/selectors';
import { Device } from './slice/types';
import { useHandleDataTable } from './useHandleDataTable';

export const DeviceListPage = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Devices');
  }, [setBreadCrumb]);

  const { actions } = useDeviceManagePage();
  const [searchForm] = Form.useForm();
  const dispatch = useDispatch();
  const params = useSelector(selectParams);
  const isFilter = useSelector(selectIsFilter);
  const state = useSelector(selectState);
  const history = useHistory();
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

  const {
    statuses,
    healthStatuses,
    fetchStatuses,
    fetchHealthStatuses,
  } = useDeviceDetail();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const fetchListDevice = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchList({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

  useEffect(() => {
    fetchListDevice();
    fetchStatuses();
    fetchHealthStatuses();
  }, [fetchHealthStatuses, fetchListDevice, fetchStatuses]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const moreButton = (text: string, record: Device) => (
    <>
      <Tooltip title="Detail">
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`${PrivatePath.DEVICES}/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push(`${PrivatePath.DEVICES}/${text}/edit`);
          }}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setSelectedId(text);
          }}
        />
      </Tooltip>
    </>
  );

  const handleConfirmDelete = async () => {
    if (isDeleteMulti) {
      const ids = state.selectedRowKeys || [];
      dispatch(actions.deleteMulti({ ids }));
      dispatch(actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }));
      setIsDeleteMulti(false);
    } else {
      dispatch(actions.delete({ IdDelete: selectedId }));
    }
    setIsModalVisible(false);
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
    setIsDeleteMulti(false);
  };

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: Device[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

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

  const handleExportCsv = () => {
    console.log('export');
  };

  const columns: ColumnProps<any>[] = [
    {
      title: 'Code',
      dataIndex: 'code',
      width: 60,
      ...getColumnSorterProps('code', 0),
      ...getColumnSearchInputProps(['code'], 0, 'string'),
      render: (text, record) => (
        <StyledLink to={`${PrivatePath.DEVICES}/${record.id}`}>
          {text}
        </StyledLink>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 60,
      render: data => (data ? data.name : ''),
    },
    {
      title: 'Since',
      dataIndex: 'since',
      width: 60,
      ...getColumnSorterProps('since', 3),
      render: text => <Capitalize>{text}</Capitalize>,
    },
    {
      title: 'Employee',
      dataIndex: 'consignee',
      width: 80,
      render: data => (data ? `${data.first_name} ${data.last_name}` : ''),
    },
    {
      title: 'Health Status',
      dataIndex: 'health_status',
      width: 80,
      render: text => <Capitalize>{text}</Capitalize>,
      ...getColumnSearchSelectProps(
        'health_status',
        healthStatuses,
        'Please choose status',
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 80,
      render: text => <Capitalize>{text}</Capitalize>,
      ...getColumnSearchSelectProps('status', statuses, 'Please choose status'),
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 40,
      fixed: 'right',
      render: (text: string, record: Device, index: number) => {
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
        <title>Device Manager Page</title>
        <meta name="description" content={'Device Manager'} />
      </Helmet>
      <PageTitle title="Devices Manager">
        <TotalSearchForm
          form={searchForm}
          value={state.params.search}
          loading={state.loading ? true : false}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
        />
      </PageTitle>
      <Wrapper>
        <Row>
          <Col span={8} style={{ marginBottom: '10px' }}>
            <Row justify="start" align="middle" style={{ height: '100%' }}>
              {state.selectedRowKeys && state.selectedRowKeys.length > 0 && (
                <Button
                  type="primary"
                  size="middle"
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
              <span style={{ marginLeft: '5px' }}>
                Total: {state.pagination?.total}
              </span>
            </Row>
          </Col>
          <Col span={16}>
            <Row justify="end">
              <Button
                style={{ marginBottom: 10, marginRight: 10 }}
                type="primary"
                size="middle"
                onClick={() => history.push(PrivatePath.DEVICES_CREATE)}
                icon={<PlusCircleOutlined />}
              >
                Create
              </Button>
              <Button onClick={handleExportCsv} size="middle">
                <ExportOutlined /> Export CSV
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

const Wrapper = styled(CardLayout)``;

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

const Capitalize = styled.span`
  text-transform: capitalize;
`;
