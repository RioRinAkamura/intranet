import React, { useCallback, useEffect, useState, Key } from 'react';
import {
  Button,
  Col,
  Row,
  Table,
  Tooltip,
  Popover,
  Form,
  CheckboxOptionType,
  TablePaginationConfig,
} from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
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
import fakeAPI from 'utils/fakeAPI';
import { useAuth } from 'app/components/Auth/Context';
import { Avatar } from 'app/components/Avatar/Loadable';
import { PopoverBtn } from './components/PopoverBtn';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { api } from 'utils/api';
import { CreateTaskParam } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { IconButton } from 'app/components/Button';

type Task = models.hr.Task;

export const TaskManager = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Tasks');
  }, [setBreadCrumb]);
  const { identity } = useAuth();
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
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesOption, setEmployeesOption] = useState<CheckboxOptionType[]>(
    [],
  );
  const [projectOption, setProjectOption] = useState<CheckboxOptionType[]>([]);
  const [deleteId, setDeleteId] = useState<string>('');

  const fetchListEmployee = async () => {
    try {
      const employees: any = await fakeAPI.get('/hr/employees');
      const mapEmployeeOption: any = [...employees.results].map(employee => {
        return {
          label: employee.first_name + ' ' + employee.last_name,
          value: employee.id,
        };
      });

      setEmployeesOption(mapEmployeeOption);
      setEmployees(employees.results);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchListProject = async () => {
    try {
      const projects: any = await fakeAPI.get('/hr/projects');
      const mapProjectsOption: any = [...projects.results].map(project => {
        return {
          label: project.name,
          value: project.id,
        };
      });

      setProjectOption(mapProjectsOption);

      setProjects(projects.results);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchListEmployee();
    fetchListProject();
  }, []);

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

  const handleRemoveFollower = async follower => {
    try {
      console.log('delete');
    } catch (e) {
      console.log(e);
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
      dataIndex: 'project_name',
      width: 100,
      ...getColumnSearchInputCheckboxProps(['project'], projectOption, 0),
      render: text => text,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee_name',
      width: 130,
      render: text => text,
      ...getCustomColumnSearchInputCheckboxProps(
        ['assignee'],
        employeesOption,
        0,
      ),
    },
    {
      title: 'Followers',
      dataIndex: 'follower',
      width: 130,
      render: (followers, record) => (
        <FlexWrapper>
          <FollowersWrapper>
            {followers.map(follower => (
              <div
                style={{ margin: '0 5px', cursor: 'pointer' }}
                onClick={() => handleRemoveFollower(follower)}
              >
                <Avatar
                  size={30}
                  src={follower.avatar}
                  name={follower.first_name + ' ' + follower.last_name}
                />
              </div>
            ))}
          </FollowersWrapper>

          <PopoverBtn
            followers={followers}
            task={record}
            callback={() => {
              fetchListTask();
            }}
          />
        </FlexWrapper>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      ...getColumnSearchCheckboxProps(
        ['status'],
        [
          { label: 'Open', value: 'Open' },
          { label: 'Going', value: 'Going' },
          { label: 'Done', value: 'Done' },
        ],
        0,
        [
          { label: 'Open', value: 'Open' },
          { label: 'Going', value: 'Going' },
          { label: 'Done', value: 'Done' },
        ],
        async value => {
          await fakeAPI.patch(`/hr/tasks/${value.id}`, { ...value });
        },
      ),
      // render: text => text,
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
            setIsUpdate(true);
            form.setFieldsValue({ ...record });
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
        console.log('multi');
        const ids = state.selectedRowKeys || [];
        const arrPromise = await ids.map((id: string) => {
          // return fakeAPI.delete(`/hr/tasks/${id}`);
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

      // await fakeAPI.delete(`/hr/tasks/${deleteId}`);
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

  const handleSubmitFormTask = () => {
    form.validateFields().then(async values => {
      try {
        if (isCreate) {
          const newTask: CreateTaskParam = { ...values };
          const data: Task = await api.hr.task.create(newTask);

          await fakeAPI.post(`hr/tasks/${data?.id}/followers/`, {
            follower: identity?.id,
          });

          notify({
            type: ToastMessageType.Info,
            duration: 2,
            message: 'Add Task Successfully',
          });
        }

        // update
        if (isUpdate) {
          await fakeAPI.patch(`/hr/tasks/${values.id}`, { ...values });
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
                style={{ marginBottom: 10 }}
                type="primary"
                onClick={() => setIsCreate(true)}
                // icon={<LaptopOutlined />}
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
        content="Are you sure you want to delete this information?"
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
          form={form}
          isView={!isCreate ? isView : false}
        />
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
