import { Helmet } from 'react-helmet-async';
import React, { Key, useCallback, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import {
  Col,
  Row,
  Table,
  Form,
  TablePaginationConfig,
  Tooltip,
  Popover,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import PageTitle from 'app/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Device } from './slice/types';
import { useDeviceManagePage } from './slice';
import { selectState, selectIsFilter, selectParams } from './slice/selectors';
import { DeleteModal } from 'app/components/DeleteModal';
import { useHandleDataTable } from './useHandleDataTable';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import { useTableConfig } from 'utils/tableConfig';
import { Messages } from './messages';
import { CardLayout } from 'app/components/CardLayout';
import Button, { IconButton } from 'app/components/Button';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { PrivatePath } from 'utils/url.const';
import { StyledLink } from 'styles/StyledCommon';

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
  }, [fetchListDevice]);

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
            history.push({
              pathname: `${PrivatePath.DEVICES}/${text}`,
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
      width: 100,
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
      dataIndex: 'category_name',
      width: 100,
    },
    {
      title: 'Since',
      dataIndex: 'since',
      ...getColumnSorterProps('since', 3),

      width: 100,
      render: text => <Capitalize>{text}</Capitalize>,
    },
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      width: 150,
      render: data => (data ? data : ''),
    },
    {
      title: 'Health Status',
      dataIndex: 'health_status',
      width: 100,
      render: text => <Capitalize>{text}</Capitalize>,
      ...getColumnSearchSelectProps(
        'health_status',
        [
          { label: 'Good', value: 'good' },
          { label: 'Bad', value: 'bad' },
        ],
        'Please choose status',
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      render: text => <Capitalize>{text}</Capitalize>,
      ...getColumnSearchSelectProps(
        'status',
        [
          { label: 'Available', value: 'available' },
          { label: 'Unavailable', value: 'unavailable' },
        ],
        'Please choose status',
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      width: 100,
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
                style={{ marginBottom: 10, marginRight: 10 }}
                type="primary"
                size="middle"
                onClick={() => history.push(PrivatePath.DEVICES_CREATE)}
                icon={<PlusCircleOutlined />}
              >
                Create device
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
