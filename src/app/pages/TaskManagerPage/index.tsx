import React, { useCallback, useEffect, useState, Key } from 'react';
import {
  Button,
  Col,
  Row,
  Table,
  Tooltip,
  Popover,
  Form,
  TablePaginationConfig,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnProps } from 'antd/lib/table';
import styled from 'styled-components/macro';
import { useTableConfig } from 'utils/tableConfig';
import { useTaskManagerPage } from './slice';
import { selectState, selectParams } from './slice/selectors';
import { useHandleDataTable } from './useHandleDataTable';
import { Messages } from './translate';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { DeleteModal } from 'app/components/DeleteModal';
import { DialogModal } from 'app/components/DialogModal';
import { TaskForm } from './components/Form';
import { Avatar } from 'app/components/Avatar/Loadable';
import { api } from 'utils/api';
import {
  Task,
  CreateTaskParam,
  UpdateTaskParam,
} from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { IconButton } from 'app/components/Button';
import { Followers } from './components/Followers';
import { useHandleTasks } from './useHandleTasks';

export const TaskManager = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Tasks');
  }, [setBreadCrumb]);
  const { notify } = useNotify();
  const { actions } = useTaskManagerPage();
  const dispatch = useDispatch();
  const params = useSelector(selectParams);
  const state = useSelector(selectState);
  const {
    setSelectedRows,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(state, actions);

  const {
    getColumnSearchInputProps,
    getColumnSearchInputCheckboxProps,
    getCustomColumnSearchInputCheckboxProps,
    getColumnSearchCheckboxProps,
  } = useTableConfig(state, Messages, setFilterText);

  const handleSelectedRows = (selectedRowKeys: Key[], selectedRows: Task[]) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isFollowers, setIsFollowers] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [task, setTask] = useState<Task>();

  const {
    projects,
    employees,
    projectOptions,
    employeeOptions,
    statuses,
    getProjects,
    getEmployees,
    getStatuses,
  } = useHandleTasks();

  useEffect(() => {
    getProjects();
    getEmployees();
    getStatuses();
  }, [getEmployees, getProjects, getStatuses]);

  const [form] = Form.useForm();

  const fetchListTask = useCallback(() => {
    // if (!isFilter) {
    dispatch(actions.fetchList({ params: params }));
    // }
  }, [actions, dispatch, params]);

  useEffect(() => {
    fetchListTask();
  }, [fetchListTask]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  const openFollowers = (record: Task) => {
    setTask(record);
    setIsFollowers(true);
  };

  const closeFollowers = () => {
    setIsFollowers(false);
  };

  const updateStatus = async (record: Task) => {
    let followerIds: string[] = [];

    if (record.followers) {
      followerIds = record.followers.map(follower => {
        return follower.id;
      });
    }

    try {
      await api.hr.task.update({
        ...record,
        assignee_id: record.assignee.id,
        project_id: record.project.id,
        follower_ids: followerIds,
      });
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Update Task Successfully',
      });

      fetchListTask();
    } catch (error) {
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Update Task Failed',
      });
    }
  };

  const columns: ColumnProps<Task>[] = [
    {
      title: 'Task',
      dataIndex: 'title',
      width: 130,
      render: text => text,
      ...getColumnSearchInputProps(['title'], 0, 'string'),
    },
    {
      title: 'Project',
      dataIndex: 'project',
      width: 100,
      ...getColumnSearchInputCheckboxProps(['project'], projectOptions, 0),
      render: value => value.name,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      width: 130,
      render: text => `${text.first_name} ${text.last_name}`,
      ...getCustomColumnSearchInputCheckboxProps(
        ['assignee'],
        employeeOptions,
        0,
      ),
    },
    {
      title: 'Followers',
      dataIndex: 'followers',
      width: 130,
      render: (followers, record) => (
        <FlexWrapper>
          <FollowersWrapper>
            {followers.map(follower => (
              <Avatar
                size={30}
                src={follower.avatar}
                name={follower.first_name + ' ' + follower.last_name}
              />
            ))}
          </FollowersWrapper>

          <SettingOutlined onClick={() => openFollowers(record)} />
        </FlexWrapper>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      ...getColumnSearchCheckboxProps(
        ['status'],
        statuses,
        undefined,
        undefined,
        record => {
          updateStatus(record);
        },
      ),
    },

    {
      title: 'Actions',
      dataIndex: 'id',
      width: 100,
      fixed: 'right',
      render: (text: string, record: Task, index: number) => {
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

  const moreButton = (text: string, record: Task) => (
    <>
      <Tooltip title="Edit">
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            setTask(record);
            setIsUpdate(true);
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
            setDeleteId(text);
          }}
        />
      </Tooltip>
    </>
  );

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isDeleteMulti) {
        const ids = state.selectedRowKeys || [];
        const arrPromise = await ids.map((id: string) => {
          return api.hr.task.delete(id);
        });
        await Promise.all(arrPromise);
        dispatch(actions.deleteSuccess());
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Delete Task Successfully',
        });

        setIsDeleteMulti(false);
        dispatch(
          actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }),
        );

        return;
      }

      await api.hr.task.delete(deleteId);
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Delete Task Successfully',
      });
    } catch (e) {
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Delete Task Failed',
      });
    } finally {
      fetchListTask();
      handleCancelDeleteModal();
    }
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  const getTaskUpdate = (): UpdateTaskParam | undefined => {
    if (!task) return;

    let followerIds: string[] = [];
    if (task.followers) {
      followerIds = task.followers.map(follower => {
        return follower.id;
      });
    }

    return {
      ...task,
      assignee_id: task.assignee.id,
      project_id: task.project.id,
      follower_ids: followerIds,
    };
  };

  const handleSubmitFormTask = () => {
    form.validateFields().then(async values => {
      try {
        if (isCreate) {
          const newTask: CreateTaskParam = { ...values };
          await api.hr.task.create(newTask);

          notify({
            type: ToastMessageType.Info,
            duration: 2,
            message: 'Add Task Successfully',
          });
        }

        // update
        if (isUpdate) {
          await api.hr.task.update({
            ...values,
            follower_ids: getTaskUpdate()?.follower_ids,
          });
          notify({
            type: ToastMessageType.Info,
            duration: 2,
            message: 'Update Task Successfully',
          });
        }
      } catch (e) {
        if (isCreate) {
          notify({
            type: ToastMessageType.Error,
            duration: 2,
            message: 'Add Task Failed',
          });
        }

        if (isUpdate) {
          notify({
            type: ToastMessageType.Error,
            duration: 2,
            message: 'Update Task Failed',
          });
        }
      } finally {
        // reset field
        handleCancelFormTask();
        // dispatch event fetch
        fetchListTask();
      }
    });
  };

  const handleCancelFormTask = () => {
    setIsView(false);
    setIsCreate(false);
    setIsUpdate(false);
    form.resetFields();
  };

  return (
    <>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Task Manager</PageTitle>
          </Col>
          <Col sm={8} xs={24}></Col>
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
                shape="round"
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                }}
                type="primary"
                onClick={() => setIsCreate(true)}
                icon={<PlusCircleOutlined />}
              >
                Create Task
              </Button>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              rowSelection={{
                columnWidth: 20,
                selectedRowKeys: state.selectedRowKeys,
                onChange: handleSelectedRows,
              }}
              rowKey={'id'}
              dataSource={state.results}
              loading={state.loading}
              columns={columns}
              scroll={{ x: 1200 }}
              onChange={handleTableChange}
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
            />
          </Col>
        </Row>
      </Wrapper>

      <DeleteModal
        open={isModalVisible}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        content="Are you sure you want to delete this task?"
      />

      <DialogModal
        isOpen={isCreate || isUpdate}
        cancelText={'Cancel'}
        okText={isUpdate || isCreate ? 'Submit' : 'Edit'}
        title={isUpdate ? 'Update Employee Task' : 'Create Employee Task'}
        handleCancel={handleCancelFormTask}
        handleSubmit={handleSubmitFormTask}
        // loading={loading}
      >
        <TaskForm
          employees={employees}
          projects={projects}
          statuses={statuses}
          form={form}
          taskUpdate={isUpdate ? getTaskUpdate() : undefined}
          isView={!isCreate ? isView : false}
        />
      </DialogModal>

      <DialogModal
        isOpen={isFollowers}
        title="Followers"
        handleCancel={closeFollowers}
        footer={
          <Button
            key="onCancel"
            shape="round"
            size="large"
            onClick={closeFollowers}
          >
            Cancel
          </Button>
        }
      >
        {task && (
          <Followers
            task={task}
            callback={() => {
              fetchListTask();
            }}
          />
        )}
      </DialogModal>
    </>
  );
};

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
`;

export const PageTitle = styled.p`
  font-size: 25px;
  line-height: 30px;
  color: rgb(112 112 112);
  padding: 0;
  margin: 0;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    cursor: pointer;
  }
`;
const FollowersWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  width: 80%;
`;
