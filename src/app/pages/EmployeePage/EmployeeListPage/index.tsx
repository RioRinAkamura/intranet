import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { models } from '@hdwebsoft/intranet-api-sdk';
import {
  Col,
  Form,
  Popover,
  Row,
  Table,
  TablePaginationConfig,
  Tooltip,
  Checkbox,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { Avatar } from 'app/components/Avatar/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button, { IconButton } from 'app/components/Button';
import { CardLayout } from 'app/components/CardLayout';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { DeleteModal } from 'app/components/DeleteModal';
import PageTitle from 'app/components/PageTitle';
import { TagComponent } from 'app/components/Tags/components/Tag';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { StyledLink } from 'styles/StyledCommon';
import { RootState } from 'types';
import { api } from 'utils/api';
import { useTableConfig } from 'utils/tableConfig';
import { PrivatePath } from 'utils/url.const';
import { EmployeeList } from './components/EmployeeList/Loadable';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { UsersMessages } from './messages';
import { useUserspageSlice } from './slice';
import {
  selectUserspage,
  selectUserspageIsFilter,
  selectUserspageParams,
} from './slice/selectors';
import { phoneFormat } from 'utils/phoneFormat';
import { useHandleDataTable } from './useHandleDataTable';
import { ActionIcon } from 'app/components/ActionIcon';

type Employee = models.hr.Employee;

export const EmployeeListPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Employees');
  }, [setBreadCrumb]);
  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<Employee[]>([]);
  const [isMore, setIsMore] = useState(true);
  const { notify } = useNotify();
  const [searchForm] = Form.useForm();
  const [idUserDelete, setIdUserDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalMultiDeleteVisible, setIsModalMultiDeleteVisible] = useState(
    false,
  );
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
            history.push(`${PrivatePath.EMPLOYEES}/${text}`);
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
              pathname: `${PrivatePath.EMPLOYEES}/${text}/edit`,
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
        <StyledLink to={`${PrivatePath.EMPLOYEES}/${record.id}`}>
          <Avatar
            size={40}
            src={text}
            alt={record.first_name + ' ' + record.last_name}
            name={record.first_name + ' ' + record.last_name}
          />
        </StyledLink>
      ),
    },
    {
      title: t(UsersMessages.listNameTitle()),
      dataIndex: 'first_name',
      width: 75,
      ...getColumnSorterProps('first_name', 1),
      ...getColumnSearchInputProps(['first_name', 'last_name']),
      render: (text, record: Employee) => (
        <StyledLink
          to={`${PrivatePath.EMPLOYEES}/${record.id}`}
          title={`${text} ${record.last_name}`}
        >
          {text} {record.last_name}
        </StyledLink>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 70,
      ...getColumnSorterProps('code', 2),
      ...getColumnSearchInputProps(['code']),
      render: (text, record: Employee) =>
        text ? (
          <StyledLink to={`${PrivatePath.EMPLOYEES}/${record.id}`} title={text}>
            {text}
          </StyledLink>
        ) : (
          ''
        ),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      ellipsis: false,
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
      render: (text, record: Employee) => phoneFormat(text),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      width: 70,
      ...getColumnSorterProps('position', 5),
      ...getColumnSearchInputProps(['position']),
    },
    {
      title: 'Allocable',
      dataIndex: 'allocable',
      width: 80,
      ...getColumnSorterProps('allocable', 6),
      ...getColumnSearchCheckboxFromToProps(
        ['allocable'],
        [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
        '',
        0,
        1, // isAllocableFilter
      ),
      render: (status: boolean) => <Checkbox checked={status} />,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 60,
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
      ...getColumnSorterProps('total_active_project_allocated_hour_weekly', 7),
      ...getColumnSearchCheckboxFromToProps(
        ['total_active_project_allocated_hour_weekly'],
        [
          { label: '< 40h per week', value: 1 },
          { label: '40h per week', value: 2 },
          { label: '> 40h per week', value: 3 },
        ],
        '40',
      ),
      render: (text, record: Employee) =>
        text ? (
          <StyledLink
            to={`${PrivatePath.EMPLOYEES}/${record.id}/projects`}
            title={text}
          >
            {text}
          </StyledLink>
        ) : (
          ''
        ),
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 40,
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

  const handleMultiDelete = async () => {
    try {
      await api.hr.employee.bulkDelete(
        (getUserListState?.selectedRowKeys as string[]) || [],
      );
      dispatch(actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }));
      notify({
        type: ToastMessageType.Info,
        message: 'Delete successful',
        duration: 2,
      });
      dispatch(actions.fetchUsers({ params: params }));
    } catch (e) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete failed',
        duration: 2,
      });
    } finally {
      setIsModalMultiDeleteVisible(false);
      dispatch(actions.resetStateDeleteModal());
    }
  };

  const handleCancelMultiDeleteModal = () => {
    setIsModalMultiDeleteVisible(false);
  };

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
            <Col span={2}>
              <Row justify="start">
                {getUserListState.selectedRowKeys &&
                  getUserListState.selectedRowKeys.length > 0 && (
                    <Button
                      danger
                      disabled={
                        !getUserListState?.selectedRowKeys?.length ||
                        getUserListState?.selectedRowKeys?.length === 0
                      }
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        // handleMultiDelete();
                        setIsModalMultiDeleteVisible(true);
                      }}
                    />
                  )}
              </Row>
            </Col>
            <Col span={6}>
              <span style={{ marginLeft: '6px' }}>
                Total: {getUserListState.pagination?.total}
              </span>
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
      <DeleteModal
        open={isModalMultiDeleteVisible}
        handleDelete={handleMultiDelete}
        handleCancel={handleCancelMultiDeleteModal}
        content="Are you sure you want to delete this information?"
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
