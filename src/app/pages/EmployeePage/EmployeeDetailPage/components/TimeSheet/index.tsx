import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import {
  Col,
  DatePicker,
  Form,
  Popover,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { useAuthState } from 'app/components/Auth/useAuthState';
import { IconButton } from 'app/components/Button';
import { DeleteModal } from 'app/components/DeleteModal';
import { DialogModal } from 'app/components/DialogModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { UsersMessages } from 'app/pages/EmployeePage/EmployeeListPage/messages';
import config from 'config';
import moment from 'moment';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { Wrapper } from 'styles/StyledCommon';
import { api } from 'utils/api';
import { useTableConfig } from 'utils/tableConfig';
import { datePickerViewProps } from 'utils/types';
import Button from '../../../../../components/Button';
import { Report } from './components/Report/Loadable';
import { Messages } from './message';
import { useEmployeeTimesheetSlice } from './slice';
import {
  selectEmployeeTimesheetParams,
  selectEmployeeTimesheetState,
} from './slice/selectors';
import { useHandleDataTable } from './useHandleDataTable';
import { useHandleEmployeeTimesheets } from './useHandleEmployeeTimesheets';

const { Option } = Select;

interface TimeSheetProps {
  employeeId: string;
}

export const TimeSheet = ({ employeeId }: TimeSheetProps) => {
  const [form] = Form.useForm();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isDeleteMulti, setIsDeleteMulti] = useState<boolean>(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>();
  const [reportListByDate, setReportListByDate] = useState<any[]>();
  const [employee, setEmployee] = useState<any>();

  const [isStaff, setIsStaff] = useState<boolean>(false);
  const { identity } = useAuthState();
  const userId = identity?.employee?.id;
  useEffect(() => {
    if (identity && identity?.role?.length === 0) return;
    if (identity && identity?.role && identity?.role[0].name === 'staff') {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [identity]);

  const { notify } = useNotify();
  const { t } = useTranslation();

  const DATE_FORMAT = config.DATE_FORMAT;
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };
  const today = new Date();
  const [newDate, setNewDate] = useState<any>(
    moment(today).format(DATE_FORMAT),
  );

  const dispatch = useDispatch();
  const { actions } = useEmployeeTimesheetSlice();
  const state = useSelector(selectEmployeeTimesheetState);
  const params = useSelector(selectEmployeeTimesheetParams);
  const { setFilterText, setSelectedRows, setPagination } = useHandleDataTable(
    state,
    actions,
  );

  const {
    loading,
    workStatus,
    getworkStatus,
    editEmployeeTimesheet,
    addEmployeeReport,
    deleteEmployeeTimesheet,
  } = useHandleEmployeeTimesheets();

  const {
    getColumnSearchCheckboxProps,
    getColumnSearchInputProps,
  } = useTableConfig(state, Messages, setFilterText);

  const [projectList, setProjectList] = useState<any[]>();

  const fetchEmployeeTimesheets = useCallback(() => {
    if (employeeId) {
      dispatch(
        actions.fetchEmployeeTimesheet({ params: params, id: employeeId }),
      );
      return;
    } else if (userId) {
      dispatch(actions.fetchEmployeeTimesheet({ params: params, id: userId }));
    }
  }, [dispatch, actions, params, employeeId, userId]);

  useEffect(() => {
    fetchEmployeeTimesheets();
  }, [fetchEmployeeTimesheets]);

  const fetchEmployeeProject = useCallback(async (id: string) => {
    const response = await api.hr.employee.project.list(id);
    setProjectList(response.results);
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeProject(employeeId);
      return;
    } else if (userId) {
      fetchEmployeeProject(userId);
    }
  }, [fetchEmployeeProject, employeeId, userId]);

  const fetchEmployee = useCallback(async () => {
    if (userId) {
      const response = await api.hr.employee.get(userId);
      const employeeInfo = {
        id: response.id,
        avatar: response.avatar,
        name: response.first_name + ' ' + response.last_name,
      };
      setEmployee(employeeInfo);
      return;
    } else if (employeeId) {
      const response = await api.hr.employee.get(employeeId);
      const employeeInfo = {
        id: response.id,
        avatar: response.avatar,
        name: response.first_name + ' ' + response.last_name,
      };
      setEmployee(employeeInfo);
    }
  }, [userId, employeeId]);

  useEffect(() => {
    getworkStatus();
  }, [getworkStatus]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const showDeleteModal = () => {
    setIsDelete(true);
  };

  const onViewClick = async (record: EmployeeTimesheet) => {
    setSelectedTimesheet(record);
    const response: any = await api.hr.employee.report.listByDate(
      record.employee.id,
      record.date,
    );
    setReportListByDate(response.results);
    setIsView(true);
  };

  const onEditClick = async record => {
    setSelectedTimesheet(record);
    const response = await api.hr.employee.report.listByDate(
      record.employee.id,
      record.date,
    );
    setReportListByDate(response.results);
    setIsEdit(true);
  };

  useEffect(() => {
    if (reportListByDate) {
      form.setFieldsValue({
        ...reportListByDate,
        done: reportListByDate.filter(report => report.type === '2'),
        going: reportListByDate.filter(report => report.type === '3'),
        blockers: reportListByDate.filter(report => report.type === '5'),
        issues: reportListByDate.filter(report => report.type === '4'),
        todo: reportListByDate.filter(report => report.type === '6'),
        others: reportListByDate.filter(report => report.type === '7'),
        timesheets: reportListByDate.filter(report => report.type === '1'),
      });
    }
  }, [reportListByDate, form]);

  const moreButton = (record: EmployeeTimesheet) => {
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
        <Tooltip title={t(UsersMessages.listEditTooltip())}>
          <IconButton
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditClick(record)}
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
              setSelectedTimesheet(record);
            }}
          />
        </Tooltip>
      </>
    );
  };

  const onWorkStatusChange = async (value, record) => {
    let workStatusTimesheet = { ...record, work_status: value };
    try {
      if (userId) {
        await editEmployeeTimesheet(userId, workStatusTimesheet);
        fetchEmployeeTimesheets();
      } else {
        await editEmployeeTimesheet(employeeId, workStatusTimesheet);
        fetchEmployeeTimesheets();
      }
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Updated',
      });
    } catch (e) {
      console.log(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Update Failed',
      });
    }
  };

  const columns: ColumnProps<EmployeeTimesheet>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: 130,
      ...getColumnSearchInputProps(['date'], 0, 'date'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: text => (text ? moment(text).format('MM-DD-YYYY') : ''),
    },
    {
      title: 'Work status',
      dataIndex: 'work_status',
      width: 130,
      ...getColumnSearchCheckboxProps(
        ['work_status'],
        workStatus,
        undefined,
        undefined,
      ),
      render: (text, record) => {
        return (
          <Select
            defaultValue={text}
            style={{
              color: text === '1' ? 'green' : text === '2' ? 'red' : '',
              width: '100%',
            }}
            onChange={value => onWorkStatusChange(value, record)}
          >
            <Option style={{ color: 'green' }} value="1">
              ON TRACK
            </Option>
            <Option style={{ color: 'red' }} value="2">
              OFF TRACK
            </Option>
          </Select>
        );
      },
    },
    {
      title: 'Today total hours',
      dataIndex: 'today_hour_total',
      width: 100,
      render: text => text,
    },
    {
      title: 'Tomorrow total hours',
      dataIndex: 'tomorrow_hour_total',
      width: 100,
      render: text => text,
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      width: 130,
      render: text => (text ? text.name : ''),
    },
    {
      title: 'Approver',
      dataIndex: 'approver',
      width: 130,
      render: text => (text ? text.name : ''),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      render: text =>
        text === '1' ? (
          <span style={{ color: 'green' }}>Submitted</span>
        ) : text === '2' ? (
          <span style={{ color: 'red' }}>Declined</span>
        ) : text === '3' ? (
          <span style={{ color: 'green' }}>Approved</span>
        ) : (
          ''
        ),
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: EmployeeTimesheet, index: number) => {
        return (
          <>
            <Popover content={() => moreButton(record)} placement="bottom">
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: EmployeeTimesheet[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isDeleteMulti) {
        const ids = state.selectedRowKeys || [];

        const arrPromise = await ids.map((timesheetId: string) => {
          let deleteTimesheet;
          if (employeeId) {
            deleteTimesheet = api.hr.employee.timesheet.delete(
              employeeId,
              timesheetId,
            );
          } else if (userId) {
            deleteTimesheet = api.hr.employee.timesheet.delete(
              userId,
              timesheetId,
            );
          }
          return deleteTimesheet;
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
      }
      if (employeeId) {
        await deleteEmployeeTimesheet(employeeId, selectedTimesheet.id);
        fetchEmployeeTimesheets();
        return;
      } else if (userId) {
        await deleteEmployeeTimesheet(userId, selectedTimesheet.id);
        fetchEmployeeTimesheets();
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
      fetchEmployeeTimesheets();
      setIsDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDelete(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsView(false);
    setIsCreate(false);
    setIsEdit(false);
  };

  const handleToggle = () => {
    setIsEdit(!isEdit);
    setIsView(!isView);
  };

  const handleDateChange = date => {
    setNewDate(moment(date).format(DATE_FORMAT));
  };

  const onFinish = async values => {
    const doneList = values.done ? values.done : undefined;
    const goingList = values.going ? values.going : undefined;
    const blockerList = values.blockers ? values.blockers : undefined;
    const issueList = values.issues ? values.issues : undefined;
    const todoList = values.todo ? values.todo : undefined;
    const otherList = values.others ? values.others : undefined;
    const timesheetList = values.timesheets ? values.timesheets : undefined;
    let newDataArr: any[] = [];

    if (doneList) {
      const doneData = doneList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,
          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '2',
          description: value.description,
          today_hour: 0,
          tomorrow_hour: 0,
          today_progress: 0,
          tomorrow_progress: 0,
        };
      });
      newDataArr = [...newDataArr, doneData];
    }
    if (goingList) {
      const goingData = goingList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,
          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '3',
          description: value.description,
          today_hour: 0,
          tomorrow_hour: 0,
          today_progress: Number(value.today_progress),
          tomorrow_progress: Number(value.tomorrow_progress),
        };
      });
      newDataArr = [...newDataArr, goingData];
    }
    if (blockerList) {
      const blockerData = blockerList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,
          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '5',
          description: value.description,
          today_hour: 0,
          tomorrow_hour: 0,
          today_progress: 0,
          tomorrow_progress: 0,
        };
      });
      newDataArr = [...newDataArr, blockerData];
    }
    if (issueList) {
      const issueData = issueList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,
          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '4',
          description: value.description,
          today_hour: 0,
          tomorrow_hour: 0,
          today_progress: 0,
          tomorrow_progress: 0,
        };
      });
      newDataArr = [...newDataArr, issueData];
    }
    if (todoList) {
      const todoData = todoList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,

          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '6',
          description: value.description,
          today_hour: 0,
          tomorrow_hour: 0,
          today_progress: 0,
          tomorrow_progress: 0,
        };
      });
      newDataArr = [...newDataArr, todoData];
    }
    if (otherList) {
      const otherData = otherList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,
          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '7',
          description: value.description,
          today_hour: 0,
          tomorrow_hour: 0,
          today_progress: 0,
          tomorrow_progress: 0,
        };
      });
      newDataArr = [...newDataArr, otherData];
    }
    if (timesheetList) {
      const timesheetData = timesheetList.map(value => {
        return {
          id: value.id ? value.id : null,
          employee_id: employeeId ? employeeId : userId,
          project_id: value.project_id
            ? value.project_id
            : value.project
            ? value.project.id
            : null,
          reference: value.reference,
          date: selectedTimesheet?.date
            ? selectedTimesheet?.date
            : newDate
            ? newDate
            : moment(values.date).format(DATE_FORMAT),
          type: '1',
          description: value.description,
          today_hour: Number(value.today_hour),
          tomorrow_hour: Number(value.tomorrow_hour),
          today_progress: 0,
          tomorrow_progress: 0,
        };
      });
      newDataArr = [...newDataArr, timesheetData];
    }

    let reportArr = Array.prototype.concat.apply([], newDataArr);
    try {
      if (userId && isStaff) {
        await addEmployeeReport(userId, reportArr);
      } else {
        await addEmployeeReport(employeeId, reportArr);
      }
      fetchEmployeeTimesheets();
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: isCreate ? 'Create Success' : isEdit ? 'Updated' : '',
      });
    } catch (e) {
      console.log(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Failed',
      });
    }

    setIsCreate(false);
    setIsEdit(false);
    setIsView(false);
    form.resetFields();
  };

  const handleDecline = async () => {
    let declinedTimesheet = {
      ...selectedTimesheet,
      status: '2',
      approver: null,
    };
    let employeeDecline = {
      ...employee,
      id: null,
      avatar: null,
      name: null,
    };
    declinedTimesheet = { ...declinedTimesheet, approver: employeeDecline };
    try {
      await editEmployeeTimesheet(
        selectedTimesheet.employee.id,
        declinedTimesheet,
      );
      fetchEmployeeTimesheets();
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Declined',
      });
    } catch (e) {
      console.log(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Failed',
      });
    }
    setIsView(false);
    setIsEdit(false);
    setIsCreate(false);
  };

  const handleApprove = async () => {
    let approvedTimesheet = { ...selectedTimesheet, status: '3' };
    approvedTimesheet = { ...approvedTimesheet, approver: employee };
    try {
      await editEmployeeTimesheet(
        selectedTimesheet.employee.id,
        approvedTimesheet,
      );
      fetchEmployeeTimesheets();
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Approved',
      });
    } catch (e) {
      console.log(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Failed',
      });
    }
    setIsView(false);
    setIsEdit(false);
    setIsCreate(false);
  };

  return (
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
              size="normal"
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
      </Row>

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
        scroll={{ x: 1100 }}
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
      <DialogModal
        isOpen={isCreate || isEdit || isView}
        title={
          isView
            ? 'Employee Timesheet'
            : isEdit
            ? 'Update Employee Timesheet'
            : isCreate
            ? 'Create Employee Timesheet'
            : ''
        }
        handleCancel={handleCancel}
        loading={loading}
        width={1000}
        maskClosable={false}
      >
        <Form
          labelCol={{ span: 5 }}
          name="dynamic_form_nest_item"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          scrollToFirstError={true}
          requiredMark={false}
        >
          <Form.Item name="date">
            <ModalContentWrapper>
              <div>
                Date:
                <StyledDatePicker
                  {...(isView || isEdit ? datePickerViewProps : {})}
                  format={DATE_FORMAT}
                  disabledDate={disabledDate}
                  value={
                    isView || isEdit
                      ? moment(selectedTimesheet?.date)
                      : moment(newDate, DATE_FORMAT)
                  }
                  onChange={date => handleDateChange(date)}
                  style={{ marginLeft: 12 }}
                  allowClear={false}
                />
              </div>
              <div style={{ display: 'flex' }}>
                {!isCreate && (
                  <Button
                    size="normal"
                    type="default"
                    style={{ marginRight: '12px' }}
                    onClick={handleToggle}
                  >
                    {isView ? 'Edit' : 'Preview'}
                  </Button>
                )}
                <Button
                  disabled={isView}
                  type="primary"
                  htmlType="submit"
                  size="normal"
                  loading={loading}
                >
                  Submit
                </Button>
                <Button
                  size="normal"
                  disabled={isCreate}
                  danger
                  type="primary"
                  style={{ margin: '0px 12px' }}
                  onClick={handleDecline}
                  // loading={loading}
                >
                  Decline
                </Button>
                <Button
                  size="normal"
                  disabled={isCreate}
                  type="primary"
                  onClick={handleApprove}
                  // loading={loading}
                >
                  Approve
                </Button>
              </div>
            </ModalContentWrapper>
          </Form.Item>

          <Report
            employeeId={employeeId}
            isView={isView}
            isCreate={isCreate}
            isEdit={isEdit}
            form={form}
            newDate={newDate}
            reportList={reportListByDate}
            projectList={projectList}
          />
        </Form>
      </DialogModal>
      <DeleteModal
        open={isDelete}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        content="Are you sure you want to delete this information?"
      />
    </Wrapper>
  );
};

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 12px;
`;
