import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  EmployeeTimesheet,
  ReportQueryParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import { Button, Form, Popover, Table, Tooltip } from 'antd';
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>();
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
    employeeReports,
    addEmployeeReport,
    addEmployeeTimesheet,
    fetchEmployeeTimesheets,
    loading,
    deleteEmployeeTimesheet,
    fetchEmployeeReport,
  } = useHandleEmployeeTimesheets();

  useEffect(() => {
    fetchEmployeeTimesheets(employeeId);
  }, [fetchEmployeeTimesheets, employeeId]);

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
              setIsView(true);
              // history.push(`${PrivatePath.EMPLOYEES}/${id}/timesheets/${text}`);
              setSelectedTimesheet(record);
            }}
          />
        </Tooltip>
        <Tooltip title={t(UsersMessages.listEditTooltip())}>
          <IconButton
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setIsEdit(true);
              setSelectedTimesheet(record);
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
      render: text => (text === '1' ? 'ON_TRACK' : 'OFF_TRACK'),
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
    setIsOpen(false);
  };

  const handleToggle = () => {};

  const [projectList, setProjectList] = useState<any[]>([]);
  const [reportList, setReportList] = useState<any[]>([]);
  const [timesheetItems, setTimesheetItems] = useState<any[]>([]);

  const fetchEmployeeProject = useCallback(async () => {
    const response = await api.hr.employee.project.list(employeeId);
    setProjectList(response.results);
  }, [employeeId]);

  useEffect(() => {
    fetchEmployeeReport(employeeId);
    fetchEmployeeProject();
  }, [fetchEmployeeReport, employeeId, fetchEmployeeProject]);

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

  const onFinish = async values => {
    console.log('values', values);

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
    // addEmployeeReport(employeeId, reportArr as ReportQueryParams);

    try {
      for (let i = 0; i < reportArr.length; i++) {
        await addEmployeeReport(employeeId, reportArr[i]);
        // await addEmployeeTimesheet(employeeId, reportArr[i]);
      }
      fetchEmployeeTimesheets(employeeId);
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Create Success',
      });
    } catch (e) {
      console.log(e);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: 'Create Failed',
      });
    }

    // addEmployeeReport(employeeId, reportArr as ReportQueryParams);

    setIsCreate(false);
    form.resetFields();
    fetchEmployeeTimesheets(employeeId);
    fetchEmployeeReport(employeeId);
  };

  return (
    <Wrapper>
      <Header>
        <StyledButton
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setIsCreate(true);
            // history.push(`${PrivatePath.EMPLOYEES}/${id}/timesheets/create`);
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
          initialValues={
            isCreate
              ? {
                  timesheets: timesheetItems ? [''] : undefined,
                }
              : isView || isEdit
              ? {
                  done: doneArr ? [''] : undefined,
                  going: goingArr ? [''] : undefined,
                  blockers: blockerArr ? [''] : undefined,
                  issues: issuesArr ? [''] : undefined,
                  todo: todoArr ? [''] : undefined,
                  others: othersArr ? [''] : undefined,
                  timesheets: timesheetArr ? [''] : undefined,
                }
              : undefined
          }
        >
          <Report
            employeeId={id}
            isView={isView}
            isCreate={isCreate}
            isEdit={isEdit}
            form={form}
            selectedTimesheet={selectedTimesheet}
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
