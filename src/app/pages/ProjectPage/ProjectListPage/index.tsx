import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Project } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import {
  Col,
  Form,
  Popover,
  Row,
  Select,
  Table,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface';
import { ActionIcon } from 'app/components/ActionIcon';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button, { IconButton } from 'app/components/Button';
import { CardLayout } from 'app/components/CardLayout';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { DialogModal } from 'app/components/DialogModal';
import PageTitle from 'app/components/PageTitle';
import { TeamMembers } from 'app/components/TeamMembers';
import { TeamMemberModal } from 'app/components/TeamMembers/components/TeamMemberModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { TotalSearchForm } from 'app/components/TotalSearchForm/Loadable';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import config from 'config';
import moment from 'moment';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components/macro';
import { StyledLink } from 'styles/StyledCommon';
import { RootState } from 'types';
import { useTableConfig } from 'utils/tableConfig';
import { DeleteType } from 'utils/types';
import { PrivatePath } from 'utils/url.const';
import { useProjectDetail } from '../ProjectDetailPage/useProjectDetail';
import { HeaderButton } from './components/HeaderButton/Loadable';
import { ProjectList } from './components/ProjectList/Loadable';
import { ProjectsMessages } from './messages';
import { useProjectsSlice } from './slice';
import {
  selectProjects,
  selectProjectsIsFilter,
  selectProjectsParams,
} from './slice/selectors';

const { Option } = Select;

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
  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [deleteProject, setDeleteProject] = useState<any>();
  const [memberModal, setMemberModal] = useState(false);
  const [projMemberId, setProjMemberId] = useState('');
  const [openCheckedModal, setOpenCheckedModal] = useState(false);
  let [recordValue, setRecordValue] = useState<Project>();

  const deleteModalState = useSelector(
    (state: RootState) => state.employeespage,
  );
  const deleteSuccess = deleteModalState?.deleteSuccess;
  const deleteFailed = deleteModalState?.deleteFailed;
  const [textCopy, setTextCopy] = useState(false);

  const { actions } = useProjectsSlice();
  const dispatch = useDispatch();
  const params = useSelector(selectProjectsParams);
  const isFilter = useSelector(selectProjectsIsFilter);
  const getProjectState = useSelector(selectProjects);
  const { id } = useParams<Record<string, string>>();
  const {
    update,
    priorities,
    statuses,
    monitorings,
    getAllMembers,
    membersAll,
    getPriorities,
    getStatuses,
    getMonitorings,
  } = useProjectDetail();

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
    ConfirmModal,
    getColumnSearchInputCheckboxProps,
  } = useTableConfig(getProjectState, ProjectsMessages, setFilterText);

  const fetchProjects = useCallback(() => {
    if (!isFilter) {
      dispatch(actions.fetchProjects({ params: params }));
    }
  }, [actions, dispatch, isFilter, params]);

  useEffect(() => {
    fetchProjects();
    getPriorities();
    getStatuses();
    getMonitorings();
    getAllMembers();
  }, [
    fetchProjects,
    getPriorities,
    getStatuses,
    getMonitorings,
    getAllMembers,
  ]);
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
    if (isDeleteMulti) {
      if (projectIds.length > 0) {
        dispatch(actions.deleteMultiProject(projectIds));
      }
    } else {
      dispatch(actions.deleteProject(idProjectDelete));
    }
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
      You're about to permanently delete{' '}
      {isDeleteMulti ? (
        'multiple project'
      ) : (
        <Tooltip
          title={<div>{textCopy ? 'Copied!' : 'Click to copy!'}</div>}
          onVisibleChange={visible => visible === true && setTextCopy(false)}
        >
          your project{' '}
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
      )}
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

  const handleCopyProject = record => {
    const projectCopy = {
      ID: record.id,
      Name: record.name,
      Priority: record.priority,
      Status: record.status,
      Members: record.total_members,
      MembersInfo: record.members.map(
        member =>
          member.member.first_name +
          ' ' +
          member.member.last_name +
          ', ' +
          member.member.email +
          ', ' +
          member.project_role,
      ),
    };
    navigator.clipboard.writeText(JSON.stringify(projectCopy, null, '\t'));
    notify({
      type: ToastMessageType.Info,
      message: 'Copied',
      duration: 2,
    });
  };
  const moreButton = (text: string, record: any) => (
    <>
      <Tooltip title={t(ProjectsMessages.listCopyTooltip())}>
        <IconButton
          type="primary"
          shape="circle"
          size="small"
          icon={<CopyOutlined />}
          onClick={() => {
            handleCopyProject(record);
          }}
        />
      </Tooltip>
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

  const handleSelectPriority = async (value, record) => {
    record = { ...record, priority: value };
    try {
      const response = await update(record);
      if (response) {
        dispatch(actions.fetchProjects({ params: params }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const searchStatusCheckbox = statuses.filter(
    status => status.label !== 'Archived',
  );
  const handleSelectStatus = async (value, record) => {
    record = { ...record, status: value };
    try {
      const response = await update(record);

      if (response) {
        dispatch(actions.fetchProjects({ params: params }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectMonitorings = async (value, record) => {
    record = { ...record, monitoring: value };
    try {
      const response = await update(record);
      if (response) {
        dispatch(actions.fetchProjects({ params: params }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCheckedButton = record => {
    setRecordValue(record);
    setOpenCheckedModal(true);
  };

  const handleCancelCheckedModal = () => {
    setOpenCheckedModal(false);
  };

  const DATE_FORMAT = config.DATE_FORMAT;
  const handleSubmitCheckedModal = async () => {
    const checkedDate = moment(new Date()).format(DATE_FORMAT);
    if (recordValue) {
      recordValue = { ...recordValue, monitored_at: checkedDate };
      try {
        const response = await update(recordValue);
        if (response) {
          dispatch(actions.fetchProjects({ params: params }));
        }
      } catch (e) {
        console.log(e);
      }
    }
    setOpenCheckedModal(false);
  };

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
      title: 'Members',
      width: 200,
      dataIndex: 'members',
      ...getColumnSorterProps('members', 2),
      ...getColumnSearchInputCheckboxProps(['members'], membersAll, 0),
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
      width: 140,
      ...getColumnSorterProps('priority', 2),
      ...getColumnSearchCheckboxProps(
        ['priority'],
        priorities,
        undefined,
        undefined,
        async value => {
          try {
            const response = await update(value);
            if (response) {
              dispatch(actions.fetchProjects({ params: params }));
            }
          } catch (e) {
            console.log(e);
          }
        },
      ),
      render: (text, record: Project) => (
        <SelectPriority
          onChange={value => handleSelectPriority(value, record)}
          defaultValue={text}
          style={{
            color:
              record.priority === '1'
                ? 'green'
                : record.priority === '2'
                ? 'orange'
                : record.priority === '3'
                ? 'red'
                : '',
          }}
        >
          {priorities &&
            priorities.map((item, index: number) => (
              <Option
                key={index}
                value={item.value}
                style={{
                  color:
                    item.label === 'Low'
                      ? 'green'
                      : item.label === 'Medium'
                      ? 'orange'
                      : item.label === 'High'
                      ? 'red'
                      : '',
                }}
              >
                {item.label}
              </Option>
            ))}
        </SelectPriority>
      ),
    },
    {
      title: t(ProjectsMessages.listStatusTitle()),
      dataIndex: 'status',
      width: 130,
      ...getColumnSorterProps('status', 2),
      ...getColumnSearchCheckboxProps(
        ['status'],
        searchStatusCheckbox,
        undefined,
        undefined,
        async value => {
          try {
            const response = await update(value);
            if (response) {
              dispatch(actions.fetchProjects({ params: params }));
            }
          } catch (e) {
            console.log(e);
          }
        },
      ),
      render: (text, record: Project) => (
        <SelectStatus
          onChange={value => handleSelectStatus(value, record)}
          defaultValue={text}
          style={{
            color:
              record.status === '1'
                ? 'orange'
                : record.status === '2'
                ? 'red'
                : record.status === '3'
                ? 'green'
                : record.status === '4'
                ? 'grey'
                : '',
          }}
        >
          {statuses &&
            statuses.map((item, index: number) => (
              <Option
                key={index}
                value={item.value}
                style={{
                  color:
                    item.label === 'Preparing'
                      ? 'orange'
                      : item.label === 'Going'
                      ? 'red'
                      : item.label === 'Released'
                      ? 'green'
                      : item.label === 'Archived'
                      ? 'grey'
                      : '',
                }}
              >
                {item.label}
              </Option>
            ))}
        </SelectStatus>
      ),
    },

    {
      title: t(ProjectsMessages.listMonitoringTitle()),
      dataIndex: 'monitoring',
      width: 130,
      ...getColumnSorterProps('monitoring', 2),
      ...getColumnSearchCheckboxProps(
        ['monitoring'],
        monitorings,
        undefined,
        undefined,
        async value => {
          try {
            const response = await update(value);
            if (response) {
              dispatch(actions.fetchProjects({ params: params }));
            }
          } catch (e) {
            console.log(e);
          }
        },
      ),
      render: (text, record: Project) => (
        <>
          <SelectMonitorings
            onChange={value => handleSelectMonitorings(value, record)}
            defaultValue={text}
            style={{
              color:
                record.monitoring === '1'
                  ? 'green'
                  : record.monitoring === '2'
                  ? 'black'
                  : record.monitoring === '3'
                  ? '#d46b08'
                  : record.monitoring === '4'
                  ? 'red'
                  : '',
            }}
          >
            {monitorings &&
              monitorings.map((item, index: number) => (
                <Option
                  key={index}
                  value={item.value}
                  style={{
                    color:
                      item.label === 'Good'
                        ? 'green'
                        : item.label === 'Normal'
                        ? 'black'
                        : item.label === 'Concerned'
                        ? '#d46b08'
                        : item.label === 'Bad'
                        ? 'red'
                        : '',
                  }}
                >
                  {item.label}
                </Option>
              ))}
          </SelectMonitorings>
          <span>
            Last check: {moment(record.monitored_at).format('DD-MM-YYYY')}
          </span>
          <CheckedButton
            size="small"
            type="primary"
            onClick={() => handleCheckedButton(record)}
          >
            Checked
          </CheckedButton>
        </>
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
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 60,
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
          <Row gutter={[0, 8]}>
            <Col span={8}>
              <Row justify="start" align="middle" style={{ height: '100%' }}>
                {getProjectState.selectedRowKeys &&
                  getProjectState.selectedRowKeys.length > 0 && (
                    <Button
                      type="primary"
                      size="middle"
                      danger
                      disabled={
                        !getProjectState?.selectedRowKeys?.length ||
                        getProjectState?.selectedRowKeys?.length === 0
                      }
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        showDeleteModal();
                        setIsDeleteMulti(true);
                        setProjectIds(
                          getProjectState.selectedRowKeys as string[],
                        );
                      }}
                    />
                  )}
                <span style={{ marginLeft: '5px' }}>
                  Total: {getProjectState.pagination?.total}
                </span>
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
        type={isDeleteMulti ? DeleteType.MULTIPLE : DeleteType.NAME}
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={
          isDeleteMulti
            ? 'Remove multiple project'
            : `Remove ${deleteProject?.name}`
        }
        description={descriptionDelete}
        answer={isDeleteMulti ? 'DELETE' : `${deleteProject?.name}`}
      />
      <DialogModal
        isOpen={openCheckedModal}
        cancelText={'No'}
        okText={'Yes'}
        title={'Checked'}
        handleCancel={handleCancelCheckedModal}
        handleSubmit={handleSubmitCheckedModal}
      >
        <p>Are you sure you reviewed this project status carefully today? </p>
      </DialogModal>
    </>
  );
};

const TextCenter = styled.span`
  text-align: center;
  width: 100%;
  display: block;
`;

const SelectStatus = styled(Select)`
  width: 100%;
`;
const SelectPriority = styled(Select)`
  width: 100%;
`;
const SelectMonitorings = styled(Select)`
  width: 100%;
`;
const CheckedButton = styled(Button)`
  width: 100%;
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
