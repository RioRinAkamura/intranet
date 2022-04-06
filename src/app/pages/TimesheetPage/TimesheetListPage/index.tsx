import {
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ProjectTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Col, DatePicker, Form, Popover, Row, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { useAuthState } from 'app/components/Auth/useAuthState';
import { Avatar } from 'app/components/Avatar';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button, { IconButton } from 'app/components/Button';
import { DeleteModal } from 'app/components/DeleteModal';
import { DialogModal } from 'app/components/DialogModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { useHandleEmployeeTimesheets } from 'app/pages/EmployeePage/EmployeeDetailPage/components/TimeSheet/useHandleEmployeeTimesheets';
import { UsersMessages } from 'app/pages/ManageUserPage/message';
import config from 'config';
import moment from 'moment';
import { Key, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { api } from 'utils/api';
import { useTableConfig } from 'utils/tableConfig';
import { datePickerViewProps } from 'utils/types';
import { useHandleProjectTimesheets } from '../useHandleProjectTimesheet';
import { Creators } from './components/Creators';
import { ProjectTimesheetForm } from './components/Form';
import { Report } from './components/Report';
import { useProjectTimesheetSlice } from './slice';
import {
  selectProjectTimesheetParams,
  selectProjectTimesheetState,
} from './slice/selectors';
import { Messages } from './translate';
import { useHandleDataTable } from './useHandleDataTable';

export const TimesheetListPage = () => {
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Timesheets');
  }, [setBreadCrumb]);

  const [form] = Form.useForm();
  const { notify } = useNotify();
  const { t } = useTranslation();

  const DATE_FORMAT = config.DATE_FORMAT;
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };

  const {
    loading,
    projectTimesheetItems,
    employees,
    employeeReports,
    workStatus,
    getworkStatus,
    getEmployeeReport,
    getProjectTimesheetItems,
    addProjectTimesheet,
    getEmployees,
    deleteProjectTimesheet,
  } = useHandleProjectTimesheets();

  const { editEmployeeTimesheet } = useHandleEmployeeTimesheets();

  const [creatorTimesheet, setCreatorTimesheet] = useState<any[]>();
  const [selectedDate, setSelectedDate] = useState<string>();

  const [timesheet, setTimesheet] = useState<ProjectTimesheet>();
  const [creatorSelected, setCreatorSelected] = useState<string>('');
  const [isView, setIsView] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isAddCreator, setIsAddCreator] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isDeleteMulti, setIsDeleteMulti] = useState<boolean>(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<
    ProjectTimesheet
  >();
  const dispatch = useDispatch();
  const { actions } = useProjectTimesheetSlice();
  const state = useSelector(selectProjectTimesheetState);
  const params = useSelector(selectProjectTimesheetParams);
  const { setFilterText, setSelectedRows, setPagination } = useHandleDataTable(
    state,
    actions,
  );

  const { getColumnSearchCheckboxProps } = useTableConfig(
    state,
    Messages,
    setFilterText,
  );

  const [employee, setEmployee] = useState<any>();

  const { identity } = useAuthState();
  const employeeId = identity?.employee?.id;

  const fetchProjectTimesheet = useCallback(() => {
    dispatch(actions.fetchProjectTimesheet({ params: params }));
  }, [dispatch, actions, params]);

  useEffect(() => {
    fetchProjectTimesheet();
  }, [fetchProjectTimesheet]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    getworkStatus();
  }, [getworkStatus]);

  const onViewClick = async record => {
    await getProjectTimesheetItems(record.id);
    setSelectedTimesheet(record);

    setIsView(true);
  };

  const moreButton = (text, record: ProjectTimesheet) => {
    return (
      <>
        <Tooltip title={t(UsersMessages.listViewTooltip())}>
          <IconButton
            type="primary"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewClick(record)}
          />
        </Tooltip>
        <Tooltip title={t(UsersMessages.listDeleteTooltip())}>
          <IconButton
            danger
            shape="circle"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsDelete(true);
              setSelectedTimesheet(record);
            }}
          />
        </Tooltip>
      </>
    );
  };

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: ProjectTimesheet[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isDeleteMulti) {
        const ids = state.selectedRowKeys || [];
        const arrPromise = await ids.map((timesheetId: string) => {
          return api.hr.projectTimesheet.delete(timesheetId);
        });
        await Promise.all(arrPromise);
        dispatch(actions.deleteTimesheetSuccess());
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Delete Timesheets Successfully',
        });
        setIsDeleteMulti(false);
        dispatch(
          actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }),
        );
        return;
      } else if (selectedTimesheet) {
        await deleteProjectTimesheet(selectedTimesheet.id);
      }
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Delete Success',
      });
    } catch (e) {
      console.log(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Delete Failed',
      });
    } finally {
      fetchProjectTimesheet();
      setIsDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDelete(false);
  };

  const handleCancel = () => {
    setIsView(false);
    setIsCreate(false);
    setSelectedTimesheet(undefined);
    form.resetFields();
  };

  const handleCancelCreateTimesheet = () => {
    setIsCreate(false);
  };
  const handleCancelCreatorTimesheet = () => {
    setIsCreator(false);
  };

  const handleSubmitCreateTimesheet = async () => {
    const data = {
      ...form.getFieldsValue(),
      date: moment(form.getFieldsValue().date).format(DATE_FORMAT),
      creators: [
        {
          id: form.getFieldsValue().creators || null,
        },
      ],
    };
    try {
      await addProjectTimesheet(data);
      fetchProjectTimesheet();
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Success',
      });
    } catch (err) {
      console.log(err);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Failed',
      });
    }
    setIsCreate(false);
  };

  const handleCreatorClick = async (creator, record) => {
    setSelectedDate(record.date);
    setCreatorSelected(creator.name);
    await getEmployeeReport(creator.id, record.date);
    setIsCreator(true);
  };

  useEffect(() => {
    setCreatorTimesheet(employeeReports);
  }, [employeeReports]);

  const fetchEmployee = useCallback(async () => {
    if (employeeId) {
      const response = await api.hr.employee.get(employeeId);
      const employeeInfo = {
        id: response.id,
        avatar: response.avatar,
        name: response.first_name + ' ' + response.last_name,
      };
      setEmployee(employeeInfo);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleApproveAll = async record => {
    const creatorsId = record.creators.map(creator => creator.id);
    try {
      for (let id of creatorsId) {
        const response = await api.hr.employee.timesheet.listByDate(
          id,
          record.date,
        );
        const objTimesheet = Object.assign({}, ...response.results);
        const approvedTimesheet = {
          ...objTimesheet,
          approver: employee ? employee : null,
          status: '3',
        };
        editEmployeeTimesheet(id, approvedTimesheet);
      }
      fetchProjectTimesheet();
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Approved all',
      });
    } catch (err) {
      console.log(err);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Failed',
      });
    }
  };

  const openAddCreators = record => {
    setTimesheet(record);
    setIsAddCreator(true);
  };

  const handleCancelAddCreator = () => {
    setIsAddCreator(false);
  };

  const columns: ColumnProps<ProjectTimesheet>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: 100,
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: value => (value ? moment(value).format('MM-DD-YYYY') : ''),
    },
    {
      title: 'Work Status',
      dataIndex: 'work_status',
      width: 100,
      ...getColumnSearchCheckboxProps(
        ['work_status'],
        workStatus,
        undefined,
        undefined,
      ),
      render: value =>
        value === '1' ? (
          <span style={{ color: 'green' }}>ON TRACK</span>
        ) : (
          <span style={{ color: 'red' }}>OFF TRACK</span>
        ),
    },
    {
      title: 'Today Total Hours',
      dataIndex: 'today_hour_total',
      width: 100,
      render: value => value,
    },
    {
      title: 'Tomorrow Total Hours',
      dataIndex: 'tomorrow_hour_total',
      width: 100,
      render: value => value,
    },
    {
      title: 'Creators',
      dataIndex: 'creators',
      width: 170,
      render: (creators, record) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {creators.map(creator => (
                <div key={creator.id} style={{ marginTop: 4 }}>
                  <CreatorsWrapper>
                    <Avatar
                      size={30}
                      src={creator.avatar || undefined}
                      name={creator.name}
                    />
                    <CreatorStyle
                      onClick={() => handleCreatorClick(creator, record)}
                    >
                      {creator.name} <br />
                    </CreatorStyle>
                  </CreatorsWrapper>
                </div>
              ))}
            </div>
            <SettingOutlined onClick={() => openAddCreators(record)} />
          </div>
        );
      },
    },
    {
      title: 'Approved',
      dataIndex: 'approved',
      width: 80,
      render: value => value,
    },
    {
      title: '',
      width: 130,
      render: (value, record) => (
        <>
          <Button size="small" onClick={() => handleApproveAll(record)}>
            Approve All
          </Button>
        </>
      ),
    },

    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 40,
      fixed: 'right',
      render: (value: string, record: ProjectTimesheet, index: number) => {
        return (
          <>
            <Popover
              content={() => moreButton(value, record)}
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
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Project Timesheets</PageTitle>
          </Col>
          <Col sm={8} xs={24}></Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <Row>
          <Col span={8} style={{ marginBottom: '10px' }}>
            <Row justify="start" align="middle" style={{ height: '100%' }}>
              {state.selectedRowKeys && state.selectedRowKeys.length > 0 && (
                <Button
                  type="primary"
                  danger
                  size="middle"
                  disabled={
                    !state?.selectedRowKeys?.length ||
                    state?.selectedRowKeys?.length === 0
                  }
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setIsDelete(true);
                    setIsDeleteMulti(true);
                  }}
                />
              )}
              <span style={{ marginLeft: '6px' }}>
                Total: {state.pagination?.total}
              </span>
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
                Create
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
              bordered
              dataSource={state.results}
              columns={columns}
              loading={state.loading}
              scroll={{ x: 1000 }}
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

      {/* PROJECT TIMSHEET VIEW */}
      <DialogModal
        isOpen={isView}
        title="Project Timesheet"
        handleCancel={handleCancel}
        loading={loading}
        width={920}
      >
        <Form name="project-timesheets" form={form} autoComplete="off">
          <Form.Item name="date">
            <ModalContentWrapper>
              <div>
                Date:
                <DatePicker
                  {...datePickerViewProps}
                  format={'MM-DD-YYYY'}
                  disabledDate={disabledDate}
                  style={{ marginLeft: 12 }}
                  allowClear={false}
                  value={moment(selectedTimesheet?.date, DATE_FORMAT)}
                />
              </div>
            </ModalContentWrapper>
          </Form.Item>

          <Report
            isView={isView}
            form={form}
            loading={loading}
            projectTimesheetItems={projectTimesheetItems}
          />
        </Form>
      </DialogModal>

      {/* CREATE PROJECT TIMESHEET */}
      <DialogModal
        isOpen={isCreate}
        cancelText={'Cancel'}
        okText="Submit"
        title="Create Project Timesheet"
        handleCancel={handleCancelCreateTimesheet}
        handleSubmit={handleSubmitCreateTimesheet}
        loading={loading}
      >
        <ProjectTimesheetForm
          form={form}
          isView={isView}
          employees={employees}
        />
      </DialogModal>

      {/* CREATOR TIMESHEET BY DATE */}
      <DialogModal
        isOpen={isCreator}
        title={creatorSelected}
        cancelText={'Cancel'}
        handleCancel={handleCancelCreatorTimesheet}
        loading={loading}
        width={920}
      >
        <Form name="creator-timesheets" form={form} autoComplete="off">
          <Form.Item name="date">
            <ModalContentWrapper>
              <div>
                Date:
                <DatePicker
                  {...datePickerViewProps}
                  format={'MM-DD-YYYY'}
                  style={{ marginLeft: 12 }}
                  allowClear={false}
                  value={moment(selectedDate)}
                />
              </div>
            </ModalContentWrapper>
          </Form.Item>

          <Report
            isView={isView}
            form={form}
            loading={loading}
            projectTimesheetItems={creatorTimesheet}
          />
        </Form>
      </DialogModal>

      <DialogModal
        isOpen={isAddCreator}
        title="Creators"
        handleCancel={handleCancelAddCreator}
        loading={loading}
      >
        {timesheet && (
          <Creators
            timesheet={timesheet}
            callback={() => fetchProjectTimesheet()}
          />
        )}
      </DialogModal>

      <DeleteModal
        open={isDelete}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        content="Are you sure you want to delete this information?"
      />
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

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CreatorStyle = styled.span`
  cursor: pointer;
  margin-left: 6px;
  :hover {
    font-weight: 500;
  }
`;

const CreatorsWrapper = styled.div`
  display: flex;
  align-items: center;
`;
