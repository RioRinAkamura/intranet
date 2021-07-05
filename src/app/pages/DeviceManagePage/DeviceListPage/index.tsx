import { Helmet } from 'react-helmet-async';
import React, { Key, useCallback, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
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
import { Device } from './slice/types';
import { useDeviceManagePage } from './slice';
import { selectState, selectIsFilter, selectParams } from './slice/selectors';
import { DeleteModal } from 'app/components/DeleteModal';
import { useHandleDataTable } from './useHandleDataTable';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import fakeAPI from 'utils/fakeAPI';
import { useTableConfig } from 'utils/tableConfig';
import { Messages } from './translate';

interface Category {
  name: string;
  id: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
}

export const DevicesManager = () => {
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [employee, setEmployee] = useState<Employee[]>([]);

  const fetchEmployee = async () => {
    const response: any = await fakeAPI.get('/hr/employees');

    setEmployee(response.results);
  };

  const fetchCategories = async () => {
    const response: any = await fakeAPI.get('/devices/categories');

    setCategories(response.results);
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      const arrPromise = await ids.map((id: string) => {
        return fakeAPI.delete(`/device-management/devices/${id}`);
      });

      await Promise.all(arrPromise);
      dispatch(actions.deleteSuccess());

      setIsDeleteMulti(false);

      dispatch(actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }));
    } else {
      await dispatch(actions.delete({ IdDelete: selectedId }));
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

  const columns: ColumnProps<Device>[] = [
    {
      title: 'Code',
      dataIndex: 'code',
      width: 100,
      render: text => text,
      ...getColumnSearchInputProps(['code'], 0, 'string'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 100,
      render: categoryId => {
        const category: any = [...categories].find(
          (category: Category) => category.id === categoryId,
        );
        return <Capitalize>{category ? category.name : ''}</Capitalize>;
      },
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
      dataIndex: 'employee',
      width: 150,
      render: employeeId => {
        const item: any = [...employee].find((emp: Employee) => {
          return emp.id === employeeId;
        });
        const textStr = item && item.first_name + ' ' + item.last_name;
        return <Capitalize>{textStr}</Capitalize>;
      },
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
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Devices Manager</PageTitle>
          </Col>
          <Col sm={8} xs={24}>
            <TotalSearchForm
              form={searchForm}
              value={state.params.search}
              loading={state.loading ? true : false}
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
                onClick={() => history.push('/devices/create')}
                // icon={<LaptopOutlined />}
              >
                Create Device
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
  /* box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16); */
  border-radius: 10px;
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

const Capitalize = styled.span`
  text-transform: capitalize;
`;
