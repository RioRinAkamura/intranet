import { Divider } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import Blockers from './components/Blockers';
import Done from './components/Done';
import Going from './components/Going';
import Issues from './components/Issues';
import Others from './components/Others';
import Timesheets from './components/Timesheets';
import Todo from './components/Todo';

export const ShareTimesheetPage = () => {
  const search = window.location.search;
  const token = search.replace('?token=', '');
  console.log('token', token);
  const [data, setData] = useState<any[]>();

  const form = useForm();

  const [done, setDone] = useState<any[]>();
  const [going, setGoing] = useState<any[]>();
  const [blocker, setBlocker] = useState<any[]>();
  const [issue, setIssues] = useState<any[]>();
  const [todo, setTodo] = useState<any[]>();
  const [other, setOther] = useState<any[]>();
  const [timesheet, setTimesheet] = useState<any[]>();

  const fetchData = useCallback(async () => {
    const response = await api.hr.employee.timesheet.getReportShared(token);
    if (response) {
      setData(response.results);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  console.log('data', data);

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

  const date = data?.map(item => item.timesheet.date);
  console.log('date', date);

  return (
    <WrapperContent>
      <ModalContentWrapper>
        <div>Date: {date ? date[0] : ''}</div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <WrapperReportItem>
            <h3>REPORT</h3>
            <h3>DONE</h3>
            <Done reportList={done} />
            <h3>GOING</h3>
            <Going reportList={going} />
            <h3>BLOCKERS</h3>
            <Blockers reportList={blocker} />
            <h3>ISSUES</h3>
            <Issues reportList={issue} />
            <h3>TODO</h3>
            <Todo reportList={todo} />
            <h3>OTHERS</h3>
            <Others reportList={other} />
          </WrapperReportItem>
          <WrapperReportItem>
            <h3>TIMESHEET</h3>
            <Timesheets reportList={timesheet} />
          </WrapperReportItem>
        </div>
      </ModalContentWrapper>
    </WrapperContent>
  );
};

const WrapperContent = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalContentWrapper = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 40px 0px;
`;

const WrapperReportItem = styled.div`
  width: 420px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  /* border-radius: 10px; */
  padding: 16px;
`;
