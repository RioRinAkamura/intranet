import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { DatePicker, Form, Popover, Select, Table, Tooltip } from 'antd';
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
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Wrapper } from 'styles/StyledCommon';
import { api } from 'utils/api';
import { datePickerViewProps } from 'utils/types';
import Button from '../../../../../components/Button';
import { Report } from './components/Report/Loadable';
import { useHandleEmployeeTimesheets } from './useHandleEmployeeTimesheets';

const { Option } = Select;

export const TimeSheet: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<Record<string, string>>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>();
  const [reportList, setReportList] = useState<any[]>();
  const [employee, setEmployee] = useState<any>();

  const [doneList, setDoneList] = useState<any[]>();
  const [goingList, setGoingList] = useState<any[]>();
  const [blockerList, setBLockerList] = useState<any[]>();
  const [issueList, setIssueList] = useState<any[]>();
  const [todoList, setTodoList] = useState<any[]>();
  const [otherList, setOtherList] = useState<any[]>();
  const [timesheetList, setTimesheetList] = useState<any[]>();
  const [newDate, setNewDate] = useState<string>();

  const { identity } = useAuthState();
  const employeeId = identity?.employee?.id;

  const { notify } = useNotify();
  const { t } = useTranslation();

  const DATE_FORMAT = config.DATE_FORMAT;
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };
  const today = new Date();

  const {
    employeeTimesheets,
    employeeReports,
    loading,
    // workStatus,
    getworkStatus,
    editEmployeeTimesheet,
    addEmployeeReport,
    fetchEmployeeTimesheets,
    deleteEmployeeTimesheet,
    fetchEmployeeReport,
  } = useHandleEmployeeTimesheets();

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeReport(employeeId);
    } else {
      fetchEmployeeReport(id);
    }
  }, [fetchEmployeeReport, id, employeeId]);

  useEffect(() => {
    setReportList(employeeReports.results);
  }, [employeeReports]);

  const [projectList, setProjectList] = useState<any[]>();

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeTimesheets(employeeId);
    } else {
      fetchEmployeeTimesheets(id);
    }
  }, [fetchEmployeeTimesheets, id, employeeId]);

  const fetchEmployeeProject = useCallback(async (id: string) => {
    const response = await api.hr.employee.project.list(id);
    setProjectList(response.results);
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeProject(employeeId);
    } else {
      fetchEmployeeProject(id);
    }
  }, [fetchEmployeeProject, id, employeeId]);

  const fetchEmployee = useCallback(async () => {
    if (employeeId) {
      const response = await api.hr.employee.get(employeeId);
      const employeeInfo = {
        id: response.id,
        avatar: response.avatar,
        name: response.first_name + ' ' + response.last_name,
      };
      setEmployee(employeeInfo);
    } else {
      const response = await api.hr.employee.get(id);
      const employeeInfo = {
        id: response.id,
        avatar: response.avatar,
        name: response.first_name + ' ' + response.last_name,
      };
      setEmployee(employeeInfo);
    }
  }, [id, employeeId]);

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
    setReportList(response.results);
    setIsView(true);
  };

  const onEditClick = async record => {
    setSelectedTimesheet(record);
    const response: any = await api.hr.employee.report.listByDate(
      record.employee.id,
      record.date,
    );
    setReportList(response.results);
    setIsEdit(true);
  };

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
      if (employeeId) {
        await editEmployeeTimesheet(employeeId, workStatusTimesheet);
        fetchEmployeeTimesheets(employeeId);
      } else {
        await editEmployeeTimesheet(id, workStatusTimesheet);
        fetchEmployeeTimesheets(id);
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
      render: text => (text ? moment(text).format('MM-DD-YYYY') : ''),
    },
    {
      title: 'Work status',
      dataIndex: 'work_status',
      width: 130,
      // ...getColumnSearchCheckboxProps(['work_status'], workStatus),
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

  const handleConfirmDelete = async () => {
    if (!selectedTimesheet) return;
    try {
      setIsDelete(false);
      if (employeeId) {
        await deleteEmployeeTimesheet(employeeId, selectedTimesheet.id);
        fetchEmployeeTimesheets(employeeId);
        fetchEmployeeReport(employeeId);
      } else {
        await deleteEmployeeTimesheet(id, selectedTimesheet.id);
        fetchEmployeeTimesheets(id);
        fetchEmployeeReport(id);
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
    }
  };

  const handleCancelDelete = () => {
    setIsDelete(false);
  };

  const handleCancel = () => {
    setIsView(false);
    setIsCreate(false);
    setIsEdit(false);
    form.resetFields();
  };

  const handleToggle = () => {
    setIsEdit(!isEdit);
    setIsView(!isView);
  };

  const handleDateChange = date => {
    setNewDate(moment(date).format(DATE_FORMAT));
  };

  useEffect(() => {
    if (reportList) {
      const doneArr = reportList.filter(report => report.type === '2');
      setDoneList(doneArr);
      const goingArr = reportList.filter(report => report.type === '3');
      setGoingList(goingArr);
      const blockerArr = reportList.filter(report => report.type === '5');
      setBLockerList(blockerArr);
      const issuesArr = reportList.filter(report => report.type === '4');
      setIssueList(issuesArr);
      const todoArr = reportList.filter(report => report.type === '6');
      setTodoList(todoArr);
      const othersArr = reportList.filter(report => report.type === '7');
      setOtherList(othersArr);
      const timesheetArr = reportList.filter(report => report.type === '1');
      setTimesheetList(timesheetArr);
    }
  }, [reportList]);

  const initialValuesForm = {
    done: isCreate ? undefined : doneList,
    going: isCreate ? undefined : goingList,
    blockers: isCreate ? undefined : blockerList,
    issues: isCreate ? undefined : issueList,
    todo: isCreate ? undefined : todoList,
    others: isCreate ? undefined : otherList,
    timesheets: isCreate ? undefined : timesheetList,
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
          employee_id: id ? id : employeeId,
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
          employee_id: id ? id : employeeId,
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
          employee_id: id ? id : employeeId,
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
          employee_id: id ? id : employeeId,
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
          employee_id: id ? id : employeeId,
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
          employee_id: id ? id : employeeId,
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
          employee_id: id ? id : employeeId,
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
      for (let i = 0; i < reportArr.length; i++) {
        if (employeeId) {
          await addEmployeeReport(employeeId, reportArr[i]);
        } else {
          await addEmployeeReport(id, reportArr[i]);
        }
      }
      if (employeeId) {
        fetchEmployeeTimesheets(employeeId);
      } else {
        fetchEmployeeTimesheets(id);
      }
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

    if (employeeId) {
      fetchEmployeeReport(employeeId);
    } else {
      fetchEmployeeReport(id);
    }
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
      if (employeeId) {
        await editEmployeeTimesheet(employeeId, declinedTimesheet);
        fetchEmployeeTimesheets(employeeId);
      } else {
        await editEmployeeTimesheet(id, declinedTimesheet);
        fetchEmployeeTimesheets(id);
      }
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
      if (employeeId) {
        await editEmployeeTimesheet(employeeId, approvedTimesheet);
        fetchEmployeeTimesheets(employeeId);
      } else {
        await editEmployeeTimesheet(id, approvedTimesheet);
        fetchEmployeeTimesheets(id);
      }
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
      <Header>
        <StyledButton
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setIsCreate(true);
            form.resetFields();
          }}
          size="middle"
        >
          Create
        </StyledButton>
      </Header>
      <Table
        bordered
        dataSource={employeeTimesheets.results}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1100 }}
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
          // wrapperCol={{ span: 19 }}
          name="dynamic_form_nest_item"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={initialValuesForm}
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
                      : moment(today, DATE_FORMAT)
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
            employeeId={id}
            isView={isView}
            isCreate={isCreate}
            isEdit={isEdit}
            form={form}
            newDate={newDate}
            reportList={reportList}
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

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  svg {
    vertical-align: baseline;
  }
`;

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 12px;
`;
