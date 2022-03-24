import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Divider, FormInstance } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import TimesheetItem from './components/TimesheetItem';

interface TimeSheetProps {
  isCreate?: boolean;
  isView?: boolean;
  form?: FormInstance;
  selectedTimesheet?: EmployeeTimesheet;
  loading?: boolean;
  reportList?: any[];
  projectTimesheetItems?: any[];
}

export const Report = memo(
  ({
    isView,
    form,
    loading,
    reportList,
    projectTimesheetItems,
  }: TimeSheetProps) => {
    const [doneList, setDoneList] = useState<any[]>([]);
    const [goingList, setGoingList] = useState<any[]>([]);
    const [blockerList, setBlockerList] = useState<any[]>([]);
    const [issueList, setIssueList] = useState<any[]>([]);
    const [todoList, setTodoList] = useState<any[]>([]);
    const [otherList, setOtherList] = useState<any[]>([]);
    const [timesheetList, setTimesheetList] = useState<any[]>([]);

    useEffect(() => {
      if (projectTimesheetItems) {
        const doneReport = projectTimesheetItems.filter(
          report => report.type === '2',
        );
        setDoneList(doneReport);

        const goingReport = projectTimesheetItems.filter(
          report => report.type === '3',
        );
        setGoingList(goingReport);

        const blockerReport = projectTimesheetItems.filter(
          report => report.type === '5',
        );
        setBlockerList(blockerReport);

        const issueReport = projectTimesheetItems.filter(
          report => report.type === '4',
        );
        setIssueList(issueReport);

        const todoReport = projectTimesheetItems.filter(
          report => report.type === '6',
        );
        setTodoList(todoReport);

        const otherReport = projectTimesheetItems.filter(
          report => report.type === '7',
        );
        setOtherList(otherReport);

        const timesheetReport = projectTimesheetItems.filter(
          report => report.type === '1',
        );
        setTimesheetList(timesheetReport);
      }
    }, [projectTimesheetItems]);

    return (
      <>
        <ModalContentWrapper>
          <WrapperReportItem>
            <h3>Report</h3>
            <>
              <h3>DONE</h3>
              <TimesheetItem isView={isView} reportList={doneList} />
            </>
            <Divider />
            <>
              <h3>GOING</h3>
              <TimesheetItem
                isView={isView}
                reportList={goingList}
                isGoing={true}
              />
            </>
            <Divider />
            <>
              <h3>BLOCKERS</h3>
              <TimesheetItem isView={isView} reportList={blockerList} />
            </>
            <Divider />
            <>
              <h3>ISSUES</h3>
              <TimesheetItem isView={isView} reportList={issueList} />
            </>
            <Divider />
            <>
              <h3>TODO</h3>
              <TimesheetItem isView={isView} reportList={todoList} />
            </>
            <Divider />
            <>
              <h3>OTHERS</h3>
              <TimesheetItem isView={isView} reportList={otherList} />
            </>
          </WrapperReportItem>
          <WrapperReportItem>
            <h3>Timesheets</h3>
            <TimesheetItem
              isView={isView}
              reportList={timesheetList}
              isTimesheet={true}
            />
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
