import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Divider, FormInstance } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import TimesheetItem from './components/TimesheetItem';
import Button from 'app/components/Button';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';

interface TimeSheetProps {
  isCreate?: boolean;
  isView?: boolean;
  form?: FormInstance;
  selectedTimesheet?: EmployeeTimesheet;
  loading?: boolean;
  projectTimesheetItems?: any[];
}

export const Report = memo(
  ({ isView, form, loading, projectTimesheetItems }: TimeSheetProps) => {
    const { notify } = useNotify();

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

    const onCopyText = () => {
      const data = {
        Done: doneList,
        Going: goingList,
        Blockers: blockerList,
        Issues: issueList,
        Todo: todoList,
        Others: otherList,
        Timesheets: timesheetList,
      };
      navigator.clipboard.writeText(JSON.stringify(data, null, '\t'));
      notify({
        type: ToastMessageType.Info,
        message: 'Copied',
        duration: 2,
      });
    };

    const [isMark, setIsMark] = useState<boolean>(false);
    const onCopyMarkdown = () => {
      setIsMark(!isMark);
    };

    return (
      <>
        <ModalContentWrapper>
          <WrapperReportItem>
            <h3>Report</h3>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <Button type="primary" size="small" onClick={onCopyText}>
                cp(Text)
              </Button>
              <Button type="primary" size="small" onClick={onCopyMarkdown}>
                cp(Markdown)
              </Button>
              <Button type="primary" size="small">
                cp(Slack)
              </Button>
              <Button type="primary" size="small">
                cp(Word)
              </Button>
            </div>
            <>
              <h3>DONE</h3>
              <TimesheetItem
                isView={isView}
                reportList={doneList}
                isMark={isMark}
              />
            </>
            <Divider />
            <>
              <h3>GOING</h3>
              <TimesheetItem
                isView={isView}
                reportList={goingList}
                isGoing={true}
                isMark={isMark}
              />
            </>
            <Divider />
            <>
              <h3>BLOCKERS</h3>
              <TimesheetItem
                isView={isView}
                reportList={blockerList}
                isMark={isMark}
              />
            </>
            <Divider />
            <>
              <h3>ISSUES</h3>
              <TimesheetItem
                isView={isView}
                reportList={issueList}
                isMark={isMark}
              />
            </>
            <Divider />
            <>
              <h3>TODO</h3>
              <TimesheetItem
                isView={isView}
                reportList={todoList}
                isMark={isMark}
              />
            </>
            <Divider />
            <>
              <h3>OTHERS</h3>
              <TimesheetItem
                isView={isView}
                reportList={otherList}
                isMark={isMark}
              />
            </>
          </WrapperReportItem>
          <WrapperReportItem>
            <h3>Timesheets</h3>
            <TimesheetItem
              isView={isView}
              reportList={timesheetList}
              isTimesheet={true}
              isMark={isMark}
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
