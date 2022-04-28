import { QuestionCircleFilled } from '@ant-design/icons';
import { Report } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { FormInstance, Input, InputProps } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ReportItemProps {
  form?: FormInstance;
  reportList?: Report[];
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const Timesheets = ({ form, reportList }: ReportItemProps) => {
  const [timesheetReport, setTimesheetReport] = useState<Report[]>([]);

  const handleTaskClick = key => {
    const values = form?.getFieldValue('timesheets');
    const link = values.map(value => value.reference);
    const win = window.open(`${link[key]}`, '_blank');
    if (win) {
      win.focus();
    }
  };

  const values = form?.getFieldValue('timesheets');
  const projectName = values?.map(value => value?.project?.name);

  useEffect(() => {
    if (reportList) {
      const timesheetList = reportList.filter(report => report.type === '1');
      setTimesheetReport(timesheetList);
    }
  }, [reportList]);

  const handleProjectClick = key => {
    const values = form?.getFieldValue('timesheets');
    const link = values.map(value => value.project.id);
    const win = window.open(`/projects/${link[key]}/`, '_blank');
    if (win) {
      win.focus();
    }
  };

  const [isDesc, setIsDesc] = useState<boolean>(false);
  const [desc, setDesc] = useState<string>();

  const handleDescClick = key => {
    const descList = values.map(value => value.description);
    setDesc(descList[key]);
    setIsDesc(true);
  };
  const handleCancelDesc = () => {
    setIsDesc(false);
  };

  return (
    <>
      {reportList &&
        reportList.map(report => (
          <div key={report.id}>
            <WrapperItem>
              <Wrapper>
                <Label>Task: </Label>
                <Input {...inputProps} defaultValue={report.reference} />
                <IconWrapper>
                  <QuestionCircleFilled
                    style={{
                      fontSize: 18,
                      margin: 6,
                    }}
                  />
                </IconWrapper>
              </Wrapper>

              <Wrapper>
                <Label>Project: </Label>
                <Input {...inputProps} defaultValue={report.project.name} />

                <IconWrapper>
                  <QuestionCircleFilled
                    style={{
                      fontSize: 18,
                      margin: 6,
                    }}
                  />
                </IconWrapper>
              </Wrapper>
              <Wrapper>
                <Label>Note: </Label>
                <Input {...inputProps} defaultValue={report.description} />

                <IconWrapper>
                  <QuestionCircleFilled
                    style={{
                      fontSize: 18,
                      margin: 6,
                    }}
                  />
                </IconWrapper>
              </Wrapper>
              <div style={{ display: 'flex', margin: '8px 0px' }}>
                <Label>Worklog: </Label>
                <span style={{ display: 'flex' }}>
                  <div>{report.today_hour} h today</div>
                  <div style={{ padding: '0px 40px' }}>
                    {report.tomorrow_hour}h tomorrow
                  </div>
                </span>
              </div>
            </WrapperItem>
          </div>
        ))}
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`;

const WrapperItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-bottom: 8px;
  padding: 12px;
  width: 100%;
`;

const Label = styled.span`
  display: block;
  width: 20%;
`;

const IconWrapper = styled.span`
  cursor: pointer;
`;

const StyledInputProgress = styled(Input)`
  width: 40px;
  text-align: center;
  margin: 0px 2px;
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default Timesheets;
