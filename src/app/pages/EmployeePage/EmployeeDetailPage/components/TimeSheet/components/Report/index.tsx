import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import { Button, Divider, FormInstance } from 'antd';
import config from 'config';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
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
  timesheetDate?: string;
  newDate?: any;
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
    timesheetDate,
    newDate,
  }: TimeSheetProps) => {
    const [projectList, setProjectList] = useState<any[]>([]);
    const [reportList, setReportList] = useState<any[]>([]);
    const [timesheetItems, setTimesheetItems] = useState<any[]>([]);

    const DATE_FORMAT = config.DATE_FORMAT;

    const {
      employeeReports,
      fetchEmployeeReport,
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

    const doneArr = reportList.filter(report => report.type === '2');
    const goingArr = reportList.filter(report => report.type === '3');
    const blockerArr = reportList.filter(report => report.type === '5');
    const issuesArr = reportList.filter(report => report.type === '4');
    const todoArr = reportList.filter(report => report.type === '6');
    const othersArr = reportList.filter(report => report.type === '7');
    const timesheetArr = reportList.filter(report => report.type === '1');

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
                timesheetDate={timesheetDate}
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
                timesheetDate={timesheetDate}
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
                timesheetDate={timesheetDate}
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
                timesheetDate={timesheetDate}
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
                timesheetDate={timesheetDate}
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
                timesheetDate={timesheetDate}
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
                timesheetDate={timesheetDate}
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

export default Report;
