import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import ReportItem from './components/ReportItem';

export const ShareTimesheetPage = () => {
  const search = window.location.search;
  const token = search.replace('?token=', '');

  const [data, setData] = useState<any[]>();

  const [done, setDone] = useState<any[]>();
  const [going, setGoing] = useState<any[]>();
  const [blocker, setBlocker] = useState<any[]>();
  const [issue, setIssues] = useState<any[]>();
  const [todo, setTodo] = useState<any[]>();
  const [other, setOther] = useState<any[]>();
  const [timesheet, setTimesheet] = useState<any[]>();

  const fetchData = useCallback(async () => {
    const response: any = await api.hr.employee.timesheet.getReportShared(
      token,
    );
    if (response) {
      setData(response.results);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (data) {
      const doneList = data.filter(report => report.type === '2');
      setDone(doneList);
      const goingList = data.filter(report => report.type === '3');
      setGoing(goingList);
      const blockerList = data.filter(report => report.type === '5');
      setBlocker(blockerList);
      const issueList = data.filter(report => report.type === '4');
      setIssues(issueList);
      const todoList = data.filter(report => report.type === '6');
      setTodo(todoList);
      const otherList = data.filter(report => report.type === '7');
      setOther(otherList);
      const timesheetList = data.filter(report => report.type === '1');
      setTimesheet(timesheetList);
    }
  }, [data]);

  const date = data?.map(item => item.timesheet?.date);

  return (
    <WrapperContent>
      <ModalContentWrapper>
        <h2>Report</h2>
        <h3>Date: {date ? date[0] : ''}</h3>
        <WrapperReport>
          <WrapperReportItem>
            <h3>REPORT</h3>
            <h3>DONE</h3>
            <ReportItem reportList={done} />
            <h3>GOING</h3>
            <ReportItem reportList={going} isGoing={true} />
            <h3>BLOCKERS</h3>
            <ReportItem reportList={blocker} />
            <h3>ISSUES</h3>
            <ReportItem reportList={issue} />
            <h3>TODO</h3>
            <ReportItem reportList={todo} />
            <h3>OTHERS</h3>
            <ReportItem reportList={other} />
          </WrapperReportItem>
          <WrapperReportItem>
            <h3>TIMESHEET</h3>
            <ReportItem reportList={timesheet} isTimesheet={true} />
          </WrapperReportItem>
        </WrapperReport>
      </ModalContentWrapper>
    </WrapperContent>
  );
};

const WrapperContent = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fff;
  min-height: 100vh;
`;

const ModalContentWrapper = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 40px 0px;
`;

const WrapperReport = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WrapperReportItem = styled.div`
  width: 420px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 16px;
`;
