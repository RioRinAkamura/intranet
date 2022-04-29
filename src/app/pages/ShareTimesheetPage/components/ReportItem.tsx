import { QuestionCircleFilled } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import { DialogModal } from 'app/components/DialogModal';
import React, { useState } from 'react';
import styled from 'styled-components';

interface ReportItemProps {
  isGoing?: boolean;
  isTimesheet?: boolean;
  reportList?: any[];
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const ReportItem = ({ reportList, isGoing, isTimesheet }: ReportItemProps) => {
  const [isDesc, setIsDesc] = useState<boolean>(false);
  const [desc, setDesc] = useState<string>();

  const handleTaskClick = taskLink => {
    const win = window.open(`${taskLink}`, '_blank');
    if (win) {
      win.focus();
    }
  };

  const handleProjectClick = projectId => {
    const win = window.open(
      `${window.location.origin}/projects/${projectId}/`,
      '_blank',
    );
    if (win) {
      win.focus();
    }
  };

  const handleDescClick = desc => {
    setDesc(desc);
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
                    onClick={() => handleTaskClick(report.reference)}
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
                    onClick={() => handleProjectClick(report.project.id)}
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
                    onClick={() => handleDescClick(report.description)}
                  />
                </IconWrapper>
              </Wrapper>
              {isGoing && (
                <ProgressWrapper>
                  <Label>Progress: </Label>
                  <span style={{ display: 'flex' }}>
                    <div>{report.today_progress} % today</div>
                    <div style={{ padding: '0px 40px' }}>
                      {report.tomorrow_progress}% tomorrow
                    </div>
                  </span>
                </ProgressWrapper>
              )}
              {isTimesheet && (
                <ProgressWrapper>
                  <Label>Worklog: </Label>
                  <span style={{ display: 'flex' }}>
                    <div>{report.today_hour} h today</div>
                    <div style={{ padding: '0px 40px' }}>
                      {report.tomorrow_hour}h tomorrow
                    </div>
                  </span>
                </ProgressWrapper>
              )}
              {report.assignee && report.assignee.name && (
                <Wrapper>
                  <Label>Assignee: </Label>
                  <Input
                    style={{ paddingLeft: 4 }}
                    {...inputProps}
                    defaultValue={report.assignee.name}
                  />
                  <IconWrapper></IconWrapper>
                </Wrapper>
              )}
              {report.employee && report.employee.name && (
                <Wrapper>
                  <Label>Member: </Label>
                  <Input
                    style={{ paddingLeft: 4 }}
                    {...inputProps}
                    defaultValue={report.employee.name}
                  />
                </Wrapper>
              )}
            </WrapperItem>
          </div>
        ))}
      <DialogModal
        isOpen={isDesc}
        cancelText={'Cancel'}
        handleCancel={handleCancelDesc}
        title="Description"
      >
        {desc ? desc : ''}
      </DialogModal>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 32px;
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
  width: 30%;
`;

const IconWrapper = styled.span`
  cursor: pointer;
`;

const ProgressWrapper = styled.div`
  display: flex;
  margin: 4px 0px;
`;

export default ReportItem;
