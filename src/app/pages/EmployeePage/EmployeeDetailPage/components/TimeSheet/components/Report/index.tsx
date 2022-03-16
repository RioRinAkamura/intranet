import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import { Button, DatePicker, Divider, Form, FormInstance } from 'antd';
import config from 'config';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import { datePickerViewProps } from 'utils/types';
import { useHandleEmployeeTimesheets } from '../../useHandleEmployeeTimesheets';
import Blockers from './components/Blockers';
import Done from './components/Done';
import Going from './components/Going';
import Issues from './components/Issues';
import Others from './components/Others';
import Timesheets from './components/Timesheets';
import Todo from './components/Todo';

interface TimeSheetProps {
  employeeId: string;
  isCreate?: boolean;
  isEdit?: boolean;
  isView?: boolean;
  form?: FormInstance;
  selectedTimesheet?: EmployeeTimesheet;
  loading?: boolean;
}

const Report = memo(
  ({
    employeeId,
    isCreate,
    isEdit,
    isView,
    selectedTimesheet,
    loading,
    form,
  }: TimeSheetProps) => {
    const [projectList, setProjectList] = useState<any[]>([]);
    const [reportList, setReportList] = useState<any[]>([]);
    const [timesheetItems, setTimesheetItems] = useState<any[]>([]);

    // const [form] = Form.useForm();
    // const [reportItems, setReportItems] = useState<any[]>([]);
    // const inputRef = useRef<any>(null);

    const DATE_FORMAT = config.DATE_FORMAT;
    const disabledDate = (current: moment.Moment) => {
      return current > moment().endOf('day');
    };
    const today = new Date();

    const handleDecline = () => {
      console.log('decline');
    };
    const handleApprove = () => {
      console.log('approve');
    };

    // const defaultReportValue = {
    //   id: null,
    //   employee_id: employeeId,
    //   project_id: null,
    //   reference: null,
    //   date: null,
    //   type: null,
    //   description: null,
    //   today_hour: 0,
    //   tomorrow_hour: 0,
    //   today_progress: 0,
    //   tomorrow_progress: 0,
    // };

    const handleToggle = () => {};

    const {
      employeeReports,
      fetchEmployeeReport,
      fetchEmployeeTimesheets,
      addEmployeeReport,
    } = useHandleEmployeeTimesheets();

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

    const onFinish = values => {
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

      for (let i = 0; i < reportArr.length; i++) {
        addEmployeeReport(employeeId, reportArr[i]);
      }
      fetchEmployeeTimesheets(employeeId);
      fetchEmployeeReport(employeeId);
    };

    const handleSyncClick = () => {
      const values = form?.getFieldsValue();
      console.log('formValue', values);

      const doneList = values.done ? values.done : undefined;
      const goingList = values.going ? values.going : undefined;
      const blockerList = values.blockers ? values.blockers : undefined;
      const issueList = values.issues ? values.issues : undefined;
      const todoList = values.todo ? values.todo : undefined;
      const otherList = values.others ? values.others : undefined;

      let timesheetArr: any[] = [];

      if (doneList) {
        const doneData = doneList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        timesheetArr = [...timesheetArr, doneData];
      }
      if (goingList) {
        const goingData = goingList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        timesheetArr = [...timesheetArr, goingData];
      }
      if (blockerList) {
        const blockerData = blockerList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        timesheetArr = [...timesheetArr, blockerData];
      }
      if (issueList) {
        const issuesData = issueList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        timesheetArr = [...timesheetArr, issuesData];
      }
      if (todoList) {
        const todoData = todoList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        timesheetArr = [...timesheetArr, todoData];
      }
      if (otherList) {
        const otherData = otherList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        timesheetArr = [...timesheetArr, otherData];
      }

      let reportArr = Array.prototype.concat.apply([], timesheetArr);

      const arrayUnique = [
        ...new Map(
          reportArr.map((item: any) => [item['reference'], item]),
        ).values(),
      ];
      console.log('arrayUnique', arrayUnique);

      setTimesheetItems(arrayUnique);

      // form?.setFieldsValue(values => ({
      //   ...values,
      //   timesheets: timesheetItems,
      // }));
    };

    return (
      <>
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
            <div>
              {!isCreate && (
                <Button
                  type="default"
                  style={{ marginRight: '12px' }}
                  onClick={handleToggle}
                >
                  {isView ? 'Edit' : 'Preview'}
                </Button>
              )}
              <ButtonStyled type="submit">Submit</ButtonStyled>
              <Button
                disabled={isCreate}
                danger
                type="primary"
                style={{ margin: '0px 12px' }}
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button
                disabled={isCreate}
                type="primary"
                onClick={handleApprove}
              >
                Approve
              </Button>
            </div>
          </ModalContentWrapper>
        </Form.Item>
        <ModalContentWrapper>
          <WrapperReportItem>
            <h3>Report</h3>
            <>
              <h3>DONE</h3>
              <Done
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                projectList={projectList}
                doneArr={doneArr}
              />
            </>
            <Divider />
            <>
              <h3>GOING</h3>
              <Going
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                projectList={projectList}
                goingArr={goingArr}
              />
            </>
            <Divider />
            <>
              <h3>BLOCKERS</h3>
              <Blockers
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                projectList={projectList}
                blockerArr={blockerArr}
              />
            </>
            <Divider />
            <>
              <h3>ISSUES</h3>
              <Issues
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                projectList={projectList}
                issuesArr={issuesArr}
              />
            </>
            <Divider />
            <>
              <h3>TODO</h3>
              <Todo
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                projectList={projectList}
                todoArr={todoArr}
              />
            </>
            <Divider />
            <>
              <h3>OTHERS</h3>
              <Others
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                projectList={projectList}
                othersArr={othersArr}
              />
            </>
          </WrapperReportItem>
          <WrapperReportItem>
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Timesheet</h3>
                <Button
                  type="primary"
                  style={{ marginBottom: 12 }}
                  onClick={handleSyncClick}
                >
                  Sync
                </Button>
              </div>
              <Timesheets
                employeeId={employeeId}
                isCreate={isCreate}
                isView={isView}
                isEdit={isEdit}
                timesheetItems={timesheetItems}
                projectList={projectList}
                timesheetArr={timesheetArr}
              />
            </>
          </WrapperReportItem>
        </ModalContentWrapper>
      </>
    );
  },
);

const WrapperReportItem = styled.div`
  width: 420px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  /* border-radius: 10px; */
  padding: 16px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 12px;
`;

const ButtonStyled = styled.button`
  background-color: #1c91ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  height: 72%;
  width: 80px;
  cursor: pointer;
  :hover {
    background-color: #188fffcc;
  }
`;

export default Report;
