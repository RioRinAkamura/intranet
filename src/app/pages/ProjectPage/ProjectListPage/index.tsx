import {
  Col,
  Row,
  Table,
  Form,
  TablePaginationConfig,
  CheckboxOptionType,
  Tooltip,
  Popover,
} from 'antd';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface';
import { Helmet } from 'react-helmet-async';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { ProjectList } from './components/ProjectList/Loadable';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components/macro';
import { useProjectsSlice } from './slice';
import { useUserspageSlice } from 'app/pages/EmployeePage/EmployeeListPage/slice';
import { selectUserspage } from 'app/pages/EmployeePage/EmployeeListPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from 'app/components/PageTitle';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useTableConfig } from 'utils/tableConfig';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import {
  selectProjects,
  selectProjectsIsFilter,
  selectProjectsParams,
} from './slice/selectors';
import moment from 'moment';
import { ProjectsMessages } from './messages';
import { TotalSearchForm } from 'app/components/TotalSearchForm/Loadable';
import { TeamMembers } from 'app/components/TeamMembers';
import { CardLayout } from 'app/components/CardLayout';
import Button, { IconButton } from 'app/components/Button';
import { TeamMemberModal } from 'app/components/TeamMembers/components/TeamMemberModal';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { PrivatePath } from 'utils/url.const';
import { StyledLink } from 'styles/StyledCommon';
import { Project } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

export const ProjectListPage: React.FC = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Projects');
  }, [setBreadCrumb]);
  const { t } = useTranslation();
  const history = useHistory();
  const [moreLoading, setMoreLoading] = useState(true);
  const [userList, setUserList] = useState<any[]>([]);
  const [isMore, setIsMore] = useState(true);
  const { notify } = useNotify();
  const [searchForm] = Form.useForm();
  const [idProjectDelete, setIdProjectDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteProject, setDeleteProject] = useState<any>();
  const [memberModal, setMemberModal] = useState(false);
  // const [projectId, setProjectId] = useState<any>();
  const [projMemberId, setProjMemberId] = useState('');
  const deleteModalState = useSelector(
    (state: RootState) => state.employeespage,
  );
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const [textCopy, setTextCopy] = useState(false);
  const getUserListState = useSelector(selectUserspage);

  const { actions } = useProjectsSlice();
  const { actions: userActions } = useUserspageSlice();
  const dispatch = useDispatch();
  const [userOptions, setUserOptions] = useState<CheckboxOptionType[]>([]);
  const params = useSelector(selectProjectsParams);
  const isFilter = useSelector(selectProjectsIsFilter);
  const getProjectState = useSelector(selectProjects);
  const { id } = useParams<Record<string, string>>();

  const fetchUsers = useCallback(() => {
    dispatch(
      userActions.fetchUsers({ params: { limit: 1000, page: undefined } }),
    );
  }, [userActions, dispatch]);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(getProjectState, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchCheckboxProps,
    getColumnSearchInputCheckboxProps,
    ConfirmModal,
  } = useTableConfig(getProjectState, ProjectsMessages, setFilterText);

  const fetchProjects = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchProjects({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const mapUsers: any =
      getUserListState.employees &&
      [...getUserListState.employees].map(user => {
        return {
          label: user.first_name + ' ' + user.last_name,
          value: user.id,
        };
      });

    setUserOptions(mapUsers);
  }, [getUserListState.employees]);

  // handle project member
  useEffect(() => {
    if (history.location.pathname.includes('members')) {
      setMemberModal(true);
      setProjMemberId(id);
    } else {
      setMemberModal(false);
    }
  }, [history.location.pathname, id]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    dispatch(actions.deleteProject(idProjectDelete));
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
        >{`${deleteProject?.name}`}</strong>
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
      <Tooltip title={t(ProjectsMessages.listViewTooltip())}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            history.push(`${PrivatePath.PROJECTS}/${text}`);
          }}
        />
      </Tooltip>
      <Tooltip title={t(ProjectsMessages.listEditTooltip())}>
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            history.push({
              pathname: `${PrivatePath.PROJECTS}/${text}`,
              state: { edit: true },
            });
          }}
        />
      </Tooltip>
      <Tooltip title={t(ProjectsMessages.listDeleteTooltip())}>
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setIdProjectDelete(text);
            setDeleteProject(record);
          }}
        />
      </Tooltip>
    </>
  );

  const columns: ColumnsType<any> = [
    {
      title: t(ProjectsMessages.listCode()),
      dataIndex: 'code',
      width: 110,
      ...getColumnSorterProps('code', 3),
      render: (text, record: Project) =>
        text ? (
          <StyledLink to={`${PrivatePath.PROJECTS}/${record.id}`} title={text}>
            {text}
          </StyledLink>
        ) : (
          ''
        ),
    },
    {
      title: t(ProjectsMessages.listNameTitle()),
      dataIndex: 'name',
      width: 130,
      fixed: 'left',
      ...getColumnSorterProps('name', 1),
      ...getColumnSearchInputProps(['name']),
      render: (text, record: Project) => (
        <StyledLink to={`${PrivatePath.PROJECTS}/${record.id}`} title={text}>
          {text}
        </StyledLink>
      ),
    },
    {
      title: 'Member',
      width: 200,
      dataIndex: 'members',
      ...getColumnSorterProps('members', 2),
      render: (members, record: any) => (
        <TeamMembers
          callback={members => {
            // dispatch(actions.fetchProjects({ params: params }));
            setMemberModal(true);
            setProjMemberId(record.id);
          }}
          projId={record.id}
          members={members}
        />
      ),
      ...getColumnSearchInputCheckboxProps(['employee'], userOptions, 0),
    },
    {
      title: t(ProjectsMessages.listStartedTitle()),
      dataIndex: 'started',
      width: 120,
      render: text => (text ? moment(text).format('DD-MM-YYYY') : ''),
    },
    {
      title: t(ProjectsMessages.listPriorityTitle()),
      dataIndex: 'priority',
      ...getColumnSorterProps('priority', 2),
      ...getColumnSearchCheckboxProps(
        ['priority'],
        [
          { label: 'Low', value: 1 },
          { label: 'Medium', value: 2 },
          { label: 'High', value: 3 },
        ],
      ),
      width: 140,
    },
    {
      title: t(ProjectsMessages.listStatusTitle()),
      dataIndex: 'status',
      width: 130,
      ...getColumnSorterProps('status', 2),
      ...getColumnSearchCheckboxProps(
        ['status'],
        [
          { label: 'Preparing', value: 1 },
          { label: 'Going', value: 2 },
          { label: 'Released', value: 3 },
          { label: 'Archived', value: 4 },
        ],
        0,
        [
          { label: 'Preparing', value: 1 },
          { label: 'Going', value: 2 },
          { label: 'Release', value: 3 },
        ],
      ),
    },
    {
      title: t(ProjectsMessages.listTotalWeeklyHours()),
      dataIndex: 'total_weekly_hour_allocated',
      width: 130,
      ...getColumnSorterProps('total_weekly_hour_allocated', 3),
      render: text => <TextCenter>{text}</TextCenter>,
    },
    {
      title: t(ProjectsMessages.listOptionsTitle()),
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

  const handleMemberModalOk = () => {
    dispatch(actions.fetchProjects({ params: params }));
    setMemberModal(false);
  };

  const handleMemberModalCancel = () => {
    dispatch(actions.fetchProjects({ params: params }));
    setMemberModal(false);
    history.push(PrivatePath.PROJECTS);
    // remove params
  };

  return (
    <>
      <TeamMemberModal
        visibility={memberModal}
        handleOk={handleMemberModalOk}
        handleCancel={handleMemberModalCancel}
        projId={projMemberId}
      />
      <ConfirmModal />
      <Helmet>
        <title>{t(ProjectsMessages.title())}</title>
        <meta name="description" content={t(ProjectsMessages.description())} />
      </Helmet>
      <PageTitle title={t(ProjectsMessages.title())}>
        <TotalSearchForm
          form={searchForm}
          value={getProjectState.params.search}
          loading={getProjectState.loading ? true : false}
          messageTrans={ProjectsMessages}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
        />
      </PageTitle>
      {isMobileOnly ? (
        <ProjectList
          loading={getProjectState.loading ? true : false}
          data={userList}
          isMore={isMore}
          moreLoading={moreLoading}
          onDelete={(id: string, project: any) => {
            showDeleteModal();
            setIdProjectDelete(id);
            setDeleteProject(project);
          }}
        />
      ) : (
        <CardLayout>
          <Row align="middle" justify="center">
            <Col span={8}>
              <Row justify="start">
                {getProjectState.selectedRowKeys &&
                  getProjectState.selectedRowKeys.length > 0 && (
                    <Button
                      danger
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
                  dataSource={getProjectState.projects}
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
        </CardLayout>
      )}
      <DeleteConfirmModal
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${deleteProject?.name}`}
        description={descriptionDelete}
        answer={`${deleteProject?.name}`}
      />
    </>
  );
};

const TextCenter = styled.span`
  text-align: center;
  width: 100%;
  display: block;
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
