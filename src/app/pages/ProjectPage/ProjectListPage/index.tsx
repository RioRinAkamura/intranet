import {
  Button,
  Col,
  Row,
  Table,
  Form,
  TablePaginationConfig,
  Tooltip,
  Popover,
  // Tag,
} from 'antd';
// import { Avatar } from 'app/components/Avatar/Loadable';
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
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { useProjectsSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from 'app/components/PageTitle';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RootState } from 'types';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useTableConfig } from 'utils/tableConfig';
import { useHandleDataTable } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import {
  selectProjects,
  selectProjectsIsFilter,
  selectProjectsParams,
} from './slice/selectors';
import moment from 'moment';
// import { antColours } from 'utils/types';
import { ProjectsMessages } from './messages';
import { TotalSearchForm } from 'app/components/TotalSearchForm/Loadable';
import { TeamMembers } from 'app/components/TeamMembers';

export const ProjectsPage: React.FC = () => {
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
  } = useHandleDataTable(getProjectState, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchCheckboxProps,
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
            history.push(`/projects/${text}`);
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
              pathname: '/projects/' + text,
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

  // const memberChildren = (dataIndex: string) => ({
  //   dataIndex: ['members'],
  //   width: 250,
  //   render: (text, record: any) => {
  //     let members;
  //     if (dataIndex === 'OTHER') {
  //       members = text.filter(
  //         item =>
  //           item.project_role !== 'PM' &&
  //           item.project_role !== 'LD' &&
  //           item.project_role !== 'QC' &&
  //           item.project_role !== 'DEV',
  //       );
  //     } else {
  //       members = text.filter(item => item.project_role === dataIndex);
  //     }
  //     return (
  //       <div>
  //         {members.length > 0 &&
  //           members.map(member => {
  //             const info = member.employee;
  //             return (
  //               <div style={{ marginBottom: '5px' }}>
  //                 <span>
  //                   <Avatar
  //                     src={info.avatar}
  //                     name={info.first_name + ' ' + info.last_name}
  //                     size={30}
  //                   />
  //                   {` ${info.first_name} ${info.last_name} `}
  //                   <Tag color={antColours[member.allocation]}>
  //                     {member.allocation}
  //                   </Tag>
  //                 </span>
  //               </div>
  //             );
  //           })}
  //       </div>
  //     );
  //   },
  // });

  const columns: ColumnsType<any> = [
    {
      title: t(ProjectsMessages.listNameTitle()),
      dataIndex: 'name',
      width: 110,
      fixed: 'left',
      ...getColumnSorterProps('name', 1),
      ...getColumnSearchInputProps(['name']),
    },
    // {
    //   title: t(ProjectsMessages.listTMTitle()),
    //   children: [
    //     {
    //       title: t(ProjectsMessages.listPMTitle()),
    //       ...memberChildren('PM'),
    //     },
    //     {
    //       title: t(ProjectsMessages.listLDTitle()),
    //       ...memberChildren('TL'),
    //     },
    //     {
    //       title: t(ProjectsMessages.listQCTitle()),
    //       ...memberChildren('QC'),
    //     },
    //     {
    //       title: t(ProjectsMessages.listDEVTitle()),
    //       ...memberChildren('DEV'),
    //     },
    //     {
    //       title: t(ProjectsMessages.listOTHERTitle()),
    //       ...memberChildren('OTHER'),
    //     },
    //   ],
    // },
    {
      title: 'Member',
      width: 200,
      dataIndex: 'members',
      render: (members, record: any) => (
        <TeamMembers
          callback={() => {
            dispatch(actions.fetchProjects({ params: params }));

            // console.log('callback');
            // fetchProjects();
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
          { label: 'Release', value: 3 },
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
      title: t(ProjectsMessages.listTotalMembers()),
      dataIndex: 'total_members',
      width: 130,
      ...getColumnSorterProps('total_members', 3),
      render: text => <TextCenter>{text}</TextCenter>,
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

  return (
    <>
      <ConfirmModal />
      <Helmet>
        <title>{t(ProjectsMessages.title())}</title>
        <meta name="description" content={t(ProjectsMessages.description())} />
      </Helmet>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>{t(ProjectsMessages.title())}</PageTitle>
          </Col>
          <Col sm={8} xs={24}>
            <TotalSearchForm
              form={searchForm}
              value={getProjectState.params.search}
              loading={getProjectState.loading ? true : false}
              messageTrans={ProjectsMessages}
              onSearch={totalSearch}
              onReset={resetTotalSearch}
            />
          </Col>
        </Row>
      </Wrapper>
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
        </Wrapper>
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
