import { QuestionCircleFilled } from '@ant-design/icons';
import { Report } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Form, Input, InputProps } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface TimesheetItemProps {
  isCreate?: boolean;
  isView?: boolean;
  reportList?: any[];
  isGoing?: boolean;
  isTimesheet?: boolean;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const TimesheetItem = ({
  isCreate,
  isView,
  reportList,
  isGoing,
  isTimesheet,
}: TimesheetItemProps) => {
  const handleTaskClick = reference => {
    const win = window.open(reference, '_blank');
    if (win) {
      win.focus();
    }
  };

  return (
    <>
      {reportList &&
        reportList.map(report => (
          <div key={report.id}>
            <WrapperItem>
              <Wrapper>
                <FormItemStyled label="Task" name="reference">
                  <Input
                    {...inputProps}
                    size="small"
                    placeholder="Enter task link"
                    defaultValue={report.reference}
                  />
                </FormItemStyled>
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
                <FormItemStyled label="Project" name="project_id">
                  <Input
                    size="small"
                    {...inputProps}
                    defaultValue={report.project?.name}
                  />
                </FormItemStyled>
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
                <FormItemStyled label="Note" name="description">
                  <Input
                    {...inputProps}
                    size="small"
                    placeholder="Description..."
                    defaultValue={report.description}
                  />
                </FormItemStyled>

                <IconWrapper>
                  <QuestionCircleFilled
                    style={{
                      fontSize: 18,
                      margin: 6,
                    }}
                  />
                </IconWrapper>
              </Wrapper>

              {isGoing && (
                <Wrapper>
                  <FormItemStyled
                    label="Progress"
                    name="today_progress"
                    style={{
                      marginTop: 0,
                      width: '40%',
                    }}
                  >
                    <StyledInputProgress
                      {...inputProps}
                      size="small"
                      defaultValue={report.today_progress}
                    />
                  </FormItemStyled>
                  <span
                    style={{
                      marginTop: 4,
                      width: '20%',
                    }}
                  >
                    % today
                  </span>
                  <FormItemStyled
                    name="tomorrow_progress"
                    style={{
                      marginTop: 0,
                      width: '12%',
                    }}
                  >
                    <StyledInputProgress
                      {...inputProps}
                      size="small"
                      defaultValue={report.tomorrow_progress}
                    />
                  </FormItemStyled>
                  <span
                    style={{
                      marginTop: 4,
                      width: '28%',
                    }}
                  >
                    % tomorrow
                  </span>
                </Wrapper>
              )}

              {isTimesheet && (
                <Wrapper>
                  <FormItemStyled
                    label="Progress"
                    name="today_hour"
                    style={{
                      marginTop: 0,
                      width: '44%',
                    }}
                  >
                    <StyledInputProgress
                      {...inputProps}
                      size="small"
                      defaultValue={report.today_hour}
                    />
                  </FormItemStyled>
                  <span
                    style={{
                      marginTop: 4,
                      width: '18%',
                    }}
                  >
                    h today
                  </span>
                  <FormItemStyled
                    style={{
                      marginTop: 0,
                      width: '18%',
                    }}
                    name="tomorrow_hour"
                  >
                    <StyledInputProgress
                      {...inputProps}
                      size="small"
                      defaultValue={report.tomorrow_hour}
                    />
                  </FormItemStyled>
                  <span
                    style={{
                      marginTop: isCreate ? 40 : 4,
                      width: '30%',
                    }}
                  >
                    h tomorrow
                  </span>
                </Wrapper>
              )}
              <Wrapper>
                <FormItemStyled
                  label="Assignee"
                  name="assignee"
                  style={{ marginTop: 30 }}
                >
                  {report?.assignee?.name}
                </FormItemStyled>
              </Wrapper>
              <div style={{ marginTop: 20 }}></div>
            </WrapperItem>
          </div>
        ))}
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
`;

const WrapperItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-bottom: 8px;
  padding: 12px;
`;

const IconWrapper = styled.span`
  cursor: pointer;
`;

const FormItemStyled = styled(Form.Item)`
  width: 100%;
`;

const StyledInputProgress = styled(Input)`
  width: 50px;
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

export default TimesheetItem;
