import {
  Col,
  Row,
  Table,
  Form,
  TablePaginationConfig,
  Tooltip,
  Popover,
} from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { UsersMessages } from './messages';
import { Helmet } from 'react-helmet-async';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { EmployeeList } from './components/EmployeeList/Loadable';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { useHandleDataTable } from './useHandleDataTable';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { useUserspageSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserspage,
  selectUserspageIsFilter,
  selectUserspageParams,
} from './slice/selectors';
import PageTitle from 'app/components/PageTitle';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useTableConfig } from 'utils/tableConfig';
import { TagComponent } from 'app/components/Tags/components/Tag';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import { CardLayout } from 'app/components/CardLayout';
import Button, { IconButton } from 'app/components/Button';

type Employee = models.hr.Employee;

export const Employees: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<Employee[]>([]);
  const [isMore, setIsMore] = useState(true);
  const { notify } = useNotify();
  const [searchForm] = Form.useForm();
  const [idUserDelete, setIdUserDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee>();
  const deleteModalState = useSelector(
    (state: RootState) => state.employeespage,
  );
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const [textCopy, setTextCopy] = useState(false);
  const [imported, setImported] = useState(false);

  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectUserspageParams);
  const isFilter = useSelector(selectUserspageIsFilter);
  const getUserListState = useSelector(selectUserspage);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(getUserListState, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchTagProps,
    getColumnSearchCheckboxFromToProps,
  } = useTableConfig(getUserListState, UsersMessages, setFilterText);

  const fetchUsers = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchUsers({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (imported) {
      dispatch(actions.fetchUsers({ params: params }));
    }
  }, [actions, dispatch, imported, params]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    dispatch(actions.deleteUser(idUserDelete));
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (deleteSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete successful',
        duration: 2,
      });
    } else if (deleteFailed) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete failed',
        duration: 2,
      });
    }
  }, [deleteFailed, deleteModalState, deleteSuccess, notify]);

  const descriptionDelete = (
    <p>
      You're about to permanently delete your employee{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied' : 'Click to copy'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        <strong
          id="deletedEmail"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            let copyText = document.getElementById('deletedEmail')?.innerText;
            if (copyText) {
              navigator.clipboard.writeText(copyText);
              setTextCopy(true);
            }
          }}
        >{`${deleteEmployee?.email}`}</strong>
      </Tooltip>
      . This will also delete any references to your employee.
    </p>
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  useEffect(() => {
    const users = getUserListState.employees;
    setUserList(prev => prev.concat(users ? users : []));
  }, [getUserListState.employees]);

  useEffect(() => {
    const handleLoadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement?.scrollHeight
      ) {
        if (moreLoading) {
          if (getUserListState.pagination?.total !== userList.length) {
            setPagination({
              current:
                getUserListState.pagination?.current &&
                getUserListState.pagination.current + 1,
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
    getUserListState.pagination,
    getUserListState.params.limit,
    isMore,
    moreLoading,
    setPagination,
    userList,
  ]);

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
    selectedRows: Employee[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const moreButton = (text: string, record: Employee) => (
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
            showDeleteModal();
            setIdUserDelete(text);
            setDeleteEmployee(record);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnProps<Employee>[] = [
    {
      dataIndex: 'avatar',
      width: 30,
      align: 'center',
      className: 'avatar',
      render: (text, record: Employee) => (
        <Avatar
          size={40}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
          name={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: t(UsersMessages.listNameTitle()),
      dataIndex: 'first_name',
      width: 75,
      ...getColumnSorterProps('first_name', 1),
      ...getColumnSearchInputProps(['first_name', 'last_name']),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 60,
      ...getColumnSorterProps('code', 5),
      ...getColumnSearchInputProps(['code']),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      width: 120,
      ...getColumnSorterProps('email', 3),
      ...getColumnSearchInputProps(['email']),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 85,
      ...getColumnSorterProps('phone', 4),
      ...getColumnSearchInputProps(['phone']),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 90,
      ...getColumnSearchTagProps('tags'),
      render: (text, record: Employee, index: number) => {
        return (
          <>
            {text.map(tag => {
              return <TagComponent tag={tag} key={tag} />;
            })}
          </>
        );
      },
    },
    {
      title: 'Hours per week',
      className: 'totalAllocated',
      dataIndex: 'total_active_project_allocated_hour_weekly',
      width: 90,
      ...getColumnSorterProps('total_active_project_allocated_hour_weekly', 6),
      ...getColumnSearchCheckboxFromToProps(
        ['total_active_project_allocated_hour_weekly'],
        [
          { label: '< 40h per week', value: 1 },
          { label: '40h per week', value: 2 },
          { label: '> 40h per week', value: 3 },
        ],
        '40',
      ),
    },
    {
      title: 'Projects',
      width: 80,
      dataIndex: 'projects',
      render: (text, render) => {
        return text?.map(project => {
          return (
            <div key={project.project_id}>
              <a
                href="#0"
                onClick={e => {
                  e.preventDefault();
                  window.open(
                    `/projects/${project.project_id}`,
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
              >
                {project.project_name}
              </a>
            </div>
          );
        });
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 50,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 50,
    },
    {
      title: t(UsersMessages.listOptionsTitle()),
      dataIndex: 'id',
      width: 50,
      fixed: 'right',
      align: 'center',
      render: (text, record: Employee, index: number) => {
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
        <title>{t(UsersMessages.title())}</title>
        <meta name="description" content={t(UsersMessages.description())} />
      </Helmet>
      <PageTitle title={t(UsersMessages.title())}>
        <TotalSearchForm
          form={searchForm}
          value={getUserListState.params.search}
          loading={getUserListState.loading ? true : false}
          messageTrans={UsersMessages}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
        />
      </PageTitle>
      {isMobileOnly ? (
        <EmployeeList
          loading={getUserListState.loading ? true : false}
          data={userList}
          isMore={isMore}
          moreLoading={moreLoading}
          onDelete={(id: string, user: Employee) => {
            showDeleteModal();
            setIdUserDelete(id);
            setDeleteEmployee(user);
          }}
        />
      ) : (
        <CardLayout>
          <Row align="middle" justify="center">
            <Col span={8}>
              <Row justify="start">
                {getUserListState.selectedRowKeys &&
                  getUserListState.selectedRowKeys.length > 0 && (
                    <Button
                      danger
                      size="large"
                      disabled={
                        !getUserListState?.selectedRowKeys?.length ||
                        getUserListState?.selectedRowKeys?.length === 0
                      }
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        console.log('Call Deleted');
                      }}
                    />
                  )}
              </Row>
            </Col>
            <Col span={16}>
              <HeaderButton
                imported={imported}
                setImported={setImported}
                selectedRows={getUserListState.selectedRows}
              />
            </Col>
            <Col span={24}>
              <TableWrapper>
                <Table
                  rowSelection={{
                    columnWidth: 20,
                    selectedRowKeys: getUserListState.selectedRowKeys,
                    onChange: handleSelectedRows,
                  }}
                  columns={columns}
                  rowKey="id"
                  dataSource={getUserListState.employees}
                  pagination={{
                    ...getUserListState.pagination,
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
                  loading={getUserListState.loading}
                  onChange={handleTableChange}
                  scroll={{ x: 1200 }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </CardLayout>
      )}
      <DeleteConfirmModal
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${deleteEmployee?.first_name} ${deleteEmployee?.last_name}`}
        description={descriptionDelete}
        answer={`${deleteEmployee?.email}`}
      />
    </>
  );
};

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
