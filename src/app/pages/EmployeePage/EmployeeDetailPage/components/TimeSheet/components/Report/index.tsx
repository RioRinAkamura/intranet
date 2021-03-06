import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Divider, FormInstance } from 'antd';
import Button from 'app/components/Button';
import config from 'config';
import moment from 'moment';
import React, { memo } from 'react';
import styled from 'styled-components';
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
  newDate?: any;
  reportList?: any[];
  projectList?: any[];
}

export const Report = memo(
  ({
    employeeId,
    isCreate,
    isEdit,
    isView,
    form,
    newDate,
    reportList,
    projectList,
  }: TimeSheetProps) => {
    const DATE_FORMAT = config.DATE_FORMAT;
    const handleSyncClick = () => {
      form?.validateFields().then(() => {
        const values = form?.getFieldsValue();
        const doneList = values.done ? values.done : undefined;
        const goingList = values.going ? values.going : undefined;
        const blockerList = values.blockers ? values.blockers : undefined;
        const issueList = values.issues ? values.issues : undefined;
        const todoList = values.todo ? values.todo : undefined;
        const otherList = values.others ? values.others : undefined;
        const timesheetList = values.timesheets ? values.timesheets : undefined;

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
              today_hour: null,
              tomorrow_hour: null,
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
              today_hour: null,
              tomorrow_hour: null,
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
              today_hour: null,
              tomorrow_hour: null,
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
              today_hour: null,
              tomorrow_hour: null,
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
              today_hour: null,
              tomorrow_hour: null,
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
              today_hour: null,
              tomorrow_hour: null,
              today_progress: 0,
              tomorrow_progress: 0,
            };
          });
          timesheetArr = [...timesheetArr, otherData];
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
              today_hour: null,
              tomorrow_hour: null,
              today_progress: 0,
              tomorrow_progress: 0,
            };
          });
          timesheetArr = [...timesheetArr, timesheetData];
        }

        let reportArr = Array.prototype.concat.apply([], timesheetArr);

        const arrayUnique = [
          ...new Map(
            reportArr.map((item: any) => [item['reference'], item]),
          ).values(),
        ];

        form?.setFieldsValue({
          timesheets: arrayUnique,
        });
      });
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
                form={form}
                reportList={reportList}
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
                form={form}
                reportList={reportList}
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
                form={form}
                reportList={reportList}
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
                form={form}
                reportList={reportList}
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
                form={form}
                reportList={reportList}
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
                form={form}
                reportList={reportList}
              />
            </>
          </WrapperReportItem>
          <WrapperReportItem>
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Timesheet</h3>
                <Button
                  size="normal"
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
                projectList={projectList}
                form={form}
                reportList={reportList}
              />
            </>
          </WrapperReportItem>
        </ModalContentWrapper>
      </>
    );
  },
);

const WrapperReportItem = styled.div`
  width: 465px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  /* border-radius: 10px; */
  padding: 16px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
