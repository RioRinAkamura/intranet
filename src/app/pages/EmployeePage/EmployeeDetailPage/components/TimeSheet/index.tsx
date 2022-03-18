import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import { DatePicker, Form, Popover, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ActionIcon } from 'app/components/ActionIcon';
import { IconButton } from 'app/components/Button';
import { DeleteModal } from 'app/components/DeleteModal';
import { DialogModal } from 'app/components/DialogModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { UsersMessages } from 'app/pages/EmployeePage/EmployeeListPage/messages';
import config from 'config';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Wrapper } from 'styles/StyledCommon';
import { api } from 'utils/api';
import { datePickerViewProps } from 'utils/types';
import Button from '../../../../../components/Button';
import Report from './components/Report';
import { useHandleEmployeeTimesheets } from './useHandleEmployeeTimesheets';

interface TimesheetProps {
  employeeId: string;
}

export const Timesheet = memo((props: TimesheetProps) => {
  const { employeeId } = props;
  const [form] = Form.useForm();

  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>();
  const [reportList, setReportList] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any>();

  const { notify } = useNotify();

  const { id } = useParams<Record<string, string>>();

  const { t } = useTranslation();

  const DATE_FORMAT = config.DATE_FORMAT;
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };
  const today = new Date();

  const {
    employeeTimesheets,
    editEmployeeTimesheet,
    employeeReports,
    addEmployeeReport,
    fetchEmployeeTimesheets,
    loading,
    deleteEmployeeTimesheet,
    fetchEmployeeReport,
  } = useHandleEmployeeTimesheets();

  useEffect(() => {
    fetchEmployeeTimesheets(employeeId);
  }, [fetchEmployeeTimesheets, employeeId]);

  const fetchEmployee = useCallback(async () => {
    const response = await api.hr.employee.get(employeeId);
    const employeeInfo = {
      id: response.id,
      avatar: response.avatar,
      name: response.first_name + ' ' + response.last_name,
    };
    setEmployee(employeeInfo);
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const showDeleteModal = () => {
    setIsDelete(true);
  };

  const moreButton = (text, record: EmployeeTimesheet) => {
    return (
      <>
        <Tooltip title={t(UsersMessages.listViewTooltip())}>
          <IconButton
            type="primary"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTimesheet(record);
              setIsView(true);
              getReportByDate(record);
            }}
          />
        </Tooltip>
        <Tooltip title={t(UsersMessages.listEditTooltip())}>
          <IconButton
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedTimesheet(record);
              setIsEdit(true);
              getReportByDate(record);
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
              setSelectedTimesheet(record);
            }}
          />
        </Tooltip>
      </>
    );
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
      dataIndex: 'status',
      width: 130,
      render: text =>
        text === '1' ? (
          'ON_TRACK'
        ) : (
          <span style={{ color: 'red' }}>OFF_TRACK</span>
        ),
    },
    {
      title: 'Total hours',
      dataIndex: 'today_hour_total',
      width: 130,
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
        text === '1 '
          ? 'Submitted'
          : text === '2'
          ? 'Declined'
          : text === '3'
          ? 'Approved'
          : '',
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: EmployeeTimesheet, index: number) => {
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

  const handleConfirmDelete = async () => {
    if (!selectedTimesheet) return;
    try {
      setIsDelete(false);
      await deleteEmployeeTimesheet(employeeId, selectedTimesheet.id);
      fetchEmployeeTimesheets(employeeId);
      fetchEmployeeReport(employeeId);
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
    form.resetFields();
    setIsView(false);
    setIsCreate(false);
    setIsEdit(false);
  };

  const handleToggle = () => {
    setIsEdit(!isEdit);
    setIsView(!isView);
  };

  useEffect(() => {
    fetchEmployeeReport(employeeId);
  }, [fetchEmployeeReport, employeeId]);

  useEffect(() => {
    setReportList(employeeReports.results.map(report => report));
  }, [employeeReports]);

  const [newDate, setNewDate] = useState<string>();

  const handleDateChange = date => {
    setNewDate(moment(date).format(DATE_FORMAT));
  };

  const doneArr = reportList.filter(report => report.type === '2');
  const goingArr = reportList.filter(report => report.type === '3');
  const blockerArr = reportList.filter(report => report.type === '5');
  const issuesArr = reportList.filter(report => report.type === '4');
  const todoArr = reportList.filter(report => report.type === '6');
  const othersArr = reportList.filter(report => report.type === '7');
  const timesheetArr = reportList.filter(report => report.type === '1');

  const [doneDateSelect, setDoneDateSelect] = useState<any[]>([]);
  const [goingDateSelect, setGoingDateSelect] = useState<any[]>([]);
  const [blockerDateSelect, setBlockerDateSelect] = useState<any[]>([]);
  const [issuesDateSelect, setIssuesDateSelect] = useState<any[]>([]);
  const [todoDateSelect, setTodoDateSelect] = useState<any[]>([]);
  const [otherDateSelect, setOtherDateSelect] = useState<any[]>([]);
  const [timesheetDateSelect, setTimesheetDateSelect] = useState<any[]>([]);

  const getReportByDate = record => {
    const doneByDate = doneArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setDoneDateSelect(doneByDate);

    const goingByDate = goingArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setGoingDateSelect(goingByDate);

    const blockerByDate = blockerArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setBlockerDateSelect(blockerByDate);

    const issuesByDate = issuesArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setIssuesDateSelect(issuesByDate);

    const todoByDate = todoArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setTodoDateSelect(todoByDate);

    const otherByDate = othersArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setOtherDateSelect(otherByDate);

    const timesheetByDate = timesheetArr.filter(
      report => report?.timesheet?.date === record?.date,
    );
    setTimesheetDateSelect(timesheetByDate);
  };

  const initialValuesForm = {
    done: isCreate ? undefined : doneDateSelect,
    going: isCreate ? undefined : goingDateSelect,
    blockers: isCreate ? undefined : blockerDateSelect,
    issues: isCreate ? undefined : issuesDateSelect,
    todo: isCreate ? undefined : todoDateSelect,
    others: isCreate ? undefined : otherDateSelect,
    timesheets: isCreate ? undefined : timesheetDateSelect,
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,
          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,
          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,
          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,
          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,

          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,
          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
          employee_id: employeeId,
          project_id: value.project_id ? value.project_id : null,

          reference: value.reference,
          date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
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
    console.log('reportArr', reportArr);

    try {
      for (let i = 0; i < reportArr.length; i++) {
        await addEmployeeReport(employeeId, reportArr[i]);
      }
      // addEmployeeReport(employeeId, reportArr as ReportQueryParams);
      fetchEmployeeTimesheets(employeeId);
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
    fetchEmployeeTimesheets(employeeId);
    fetchEmployeeReport(employeeId);
  };

  const handleDecline = async () => {
    let declinedTimesheet = { ...selectedTimesheet, status: '2' };
    declinedTimesheet = { ...declinedTimesheet, approver: employee };
    try {
      await editEmployeeTimesheet(employeeId, declinedTimesheet);
      fetchEmployeeTimesheets(employeeId);
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
      await editEmployeeTimesheet(employeeId, approvedTimesheet);
      fetchEmployeeTimesheets(employeeId);
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
        width={920}
      >
        <Form
          name="dynamic_form_nest_item"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={initialValuesForm}
        >
          <Form.Item name="date">
            <ModalContentWrapper>
              <div>
                Date:
                <StyledDatePicker
                  {...(isView ? datePickerViewProps : {})}
                  format={DATE_FORMAT}
                  disabledDate={disabledDate}
                  defaultValue={
                    isCreate
                      ? moment(today, DATE_FORMAT)
                      : moment(selectedTimesheet?.date)
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
            loading={loading}
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
});

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

// const ButtonStyled = styled.button`
//   background-color: #1c91ff;
//   color: #fff;
//   border: none;
//   border-radius: 16px;
//   height: 72%;
//   width: 80px;
//   cursor: pointer;
//   :hover {
//     background-color: #188fffcc;
//   }
// `;
