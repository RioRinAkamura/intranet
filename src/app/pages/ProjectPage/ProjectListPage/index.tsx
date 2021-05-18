import {
  Button,
  Col,
  Row,
  Table,
  Form,
  TablePaginationConfig,
  Tooltip,
  Popover,
  Tag,
} from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface';
import { UsersMessages } from './messages';
import { Helmet } from 'react-helmet-async';
import { SearchUsers } from './components/SearchUsers/Loadable';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { UserList } from './components/UserList/Loadable';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { useProjectsSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from 'app/components/PageTitle';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useTableConfig } from 'utils/tableConfig';
import { TagComponent } from 'app/components/Tags/components/Tag';
import { useHandleDataTable } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import {
  selectProjects,
  selectProjectsIsFilter,
  selectProjectsParams,
} from './slice/selectors';
import { spawn } from 'child_process';
import moment from 'moment';
import { antColours } from 'utils/types';

const projects = [
  {
    id: '1',
    members: [
      {
        allocation: 3,
        project_role: 'PM',
        employee: {
          id: '1',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 5,
        project_role: 'LD',
        employee: {
          id: '2',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 5,
        project_role: 'QC',
        employee: {
          id: '3',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 3,
        project_role: 'QC',
        employee: {
          id: '4',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 7,
        project_role: 'DEV',
        employee: {
          id: '5',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 6,
        project_role: 'DEV',
        employee: {
          id: '6',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 7,
        project_role: 'DEV',
        employee: {
          id: '7',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 8,
        project_role: 'DEV',
        employee: {
          id: '8',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
      {
        allocation: 8,
        project_role: 'OTHER',
        employee: {
          id: '9',
          code: null,
          email: 'charles43@washington-richardson.com',
          first_name: 'Melissa',
          last_name: 'Blanchard',
          starting_date: '2020-10-11',
          leaving_date: '2021-04-07',
          personal_email: 'william78@hotmail.com',
          contacts: [],
          avatar: null,
          phone: '(702)104-4429',
          dob: '1998-04-20',
          gender: 'Female',
          status: 'Single',
          type: 'Part-time',
          job_title: null,
          social: [
            {
              facebook: 'carmen43',
            },
          ],
          bank_accounts: [[{}]],
          id_number: null,
          issued_date: null,
          issued_place: null,
          social_insurance_no: null,
          tags: [],
          user: null,
        },
      },
    ],
    created: '2021-05-16T05:05:04.987035Z',
    modified: '2021-05-16T05:05:04.987437Z',
    name: 'Starter',
    started: '2021-05-16',
    priority: 'Low',
    status: 'Preparing',
    created_by: null,
    modified_by: null,
  },
];

export const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<any[]>([]);
  const [isMore, setIsMore] = useState(true);
  const { notify } = useNotify();
  const [searchForm] = Form.useForm();
  const [idUserDelete, setIdUserDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<any>();
  const deleteModalState = useSelector((state: RootState) => state.userspage);
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const [textCopy, setTextCopy] = useState(false);

  const { actions } = useProjectsSlice();
  const dispatch = useDispatch();

  const params = useSelector(selectProjectsParams);
  const isFilter = useSelector(selectProjectsIsFilter);
  const getProjectState = useSelector(selectProjects);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
    resetFilter,
  } = useHandleDataTable(getProjectState, actions);

  const { getColumnSorterProps, getColumnSearchInputProps } = useTableConfig(
    getProjectState,
    UsersMessages,
    setFilterText,
    resetFilter,
  );

  // const fetchUsers = useCallback(() => {
  //   if (!isFilter) {
  //     dispatch(actions.fetchUsers({ params: params }));
  //   }
  // }, [actions, dispatch, isFilter, params]);

  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

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

  const descriptionDelete = (
    <p>
      You're about to permanently delete your project{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied!' : 'Click to copy!'}</div>}
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
      . This will also delete any references to your project.
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
    const projects = getProjectState.projects;
    setUserList(prev => prev.concat(projects ? projects : []));
  }, [getProjectState.projects]);

  useEffect(() => {
    const handleLoadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement?.scrollHeight
      ) {
        if (moreLoading) {
          if (getProjectState.pagination?.total !== userList.length) {
            setPagination({
              current:
                getProjectState.pagination?.current &&
                getProjectState.pagination.current + 1,
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
    getProjectState.pagination,
    getProjectState.params.limit,
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

  const handleSelectedRows = (selectedRowKeys: Key[], selectedRows: any[]) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const moreButton = (text: string, record: any) => (
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

  const memberChildren = (dataIndex: string) => ({
    dataIndex: ['members'],
    width: 250,
    render: (text, record: any) => {
      let members;
      if (dataIndex === 'OTHER') {
        members = text.filter(
          item =>
            item.project_role !== 'PM' &&
            item.project_role !== 'LD' &&
            item.project_role !== 'QC' &&
            item.project_role !== 'DEV',
        );
      } else {
        members = text.filter(item => item.project_role === dataIndex);
      }
      return (
        <div>
          {members.map(member => {
            const info = member.employee;
            return (
              <div style={{ marginBottom: '5px' }}>
                <span>
                  <Avatar
                    src={info.avatar}
                    name={info.first_name + ' ' + info.last_name}
                    size={30}
                  />
                  {` ${info.first_name} ${info.last_name} `}
                  <Tag color={antColours[member.allocation]}>
                    {member.allocation}
                  </Tag>
                </span>
              </div>
            );
          })}
        </div>
      );
    },
  });

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 110,
      fixed: 'left',
      ...getColumnSorterProps('name', 1),
      ...getColumnSearchInputProps(['name']),
    },
    {
      title: 'Team Members',
      children: [
        {
          title: 'Project Manager',
          ...memberChildren('PM'),
        },
        {
          title: 'Leader',
          ...memberChildren('LD'),
        },
        {
          title: 'Quality Controller',
          ...memberChildren('QC'),
        },
        {
          title: 'Developer',
          ...memberChildren('DEV'),
        },
        {
          title: 'Other',
          ...memberChildren('OTHER'),
        },
      ],
    },
    {
      title: 'Started',
      dataIndex: 'started',
      width: 120,
      render: text => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: t(UsersMessages.listOptionsTitle()),
      dataIndex: 'id',
      width: 100,
      fixed: 'right',
      render: (text, record: any, index: number) => {
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
        <title>Projects</title>
        <meta name="description" content={t(UsersMessages.description())} />
      </Helmet>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Projects</PageTitle>
          </Col>
          <Col sm={8} xs={24}>
            <SearchUsers
              form={searchForm}
              value={getProjectState.params.search}
              loading={getProjectState.loading ? true : false}
              onSearch={totalSearch}
              onReset={resetTotalSearch}
            />
          </Col>
        </Row>
      </Wrapper>
      {isMobileOnly ? (
        <UserList
          loading={getProjectState.loading ? true : false}
          data={userList}
          isMore={isMore}
          moreLoading={moreLoading}
          onDelete={(id: string, user: any) => {
            showDeleteModal();
            setIdUserDelete(id);
            setDeleteEmployee(user);
          }}
        />
      ) : (
        <Wrapper>
          <Row align="middle" justify="center">
            <Col span={8}>
              <Row justify="start">
                {getProjectState.selectedRowKeys &&
                  getProjectState.selectedRowKeys.length > 0 && (
                    <Button
                      danger
                      size="large"
                      disabled={
                        !getProjectState?.selectedRowKeys?.length ||
                        getProjectState?.selectedRowKeys?.length === 0
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
                pagination={getProjectState.pagination}
                data={getProjectState.projects}
                selectedRows={getProjectState.selectedRows}
              />
            </Col>
            <Col span={24}>
              <TableWrapper>
                <Table
                  rowSelection={{
                    selectedRowKeys: getProjectState.selectedRowKeys,
                    onChange: handleSelectedRows,
                  }}
                  bordered
                  columns={columns}
                  rowKey="id"
                  dataSource={projects}
                  pagination={{
                    ...getProjectState.pagination,
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
                  loading={getProjectState.loading}
                  onChange={handleTableChange}
                  scroll={{ x: 1100 }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Wrapper>
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
`;
