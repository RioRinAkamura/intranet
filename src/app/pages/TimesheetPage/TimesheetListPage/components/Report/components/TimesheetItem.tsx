import { Checkbox, Form, Input, InputProps } from 'antd';
import Button from 'app/components/Button';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import React, { useState } from 'react';
import styled from 'styled-components';

interface TimesheetItemProps {
  isCreate?: boolean;
  isView?: boolean;
  reportList?: any[];
  isGoing?: boolean;
  isTimesheet?: boolean;
  isMark?: boolean;
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
  isMark,
}: TimesheetItemProps) => {
  const { notify } = useNotify();

  const [data, setData] = useState<any[]>([]);

  const onChange = event => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setData([...data, event.target.value]);
    } else {
      let index = data.indexOf(event.target.value);
      data.splice(index, 1);
      setData(data);
    }
  };

  const onCopyMD = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, '\t'));
    notify({
      type: ToastMessageType.Info,
      message: 'Copied',
      duration: 2,
    });
  };

  return (
    <>
      {isMark && (
        <Button size="small" style={{ marginBottom: 4 }} onClick={onCopyMD}>
          Copy
        </Button>
      )}
      {reportList &&
        reportList.map(report => (
          <div key={report.id}>
            <WrapperItem style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', right: 12, top: 12 }}>
                {isMark && <Checkbox value={report} onChange={onChange} />}
              </span>
              <Wrapper>
                <FormItemStyled label="Task" name="reference">
                  <Input
                    {...inputProps}
                    size="small"
                    placeholder="Enter task link"
                    defaultValue={report.reference}
                  />
                </FormItemStyled>
              </Wrapper>
              <Wrapper>
                <FormItemStyled label="Project" name="project_id">
                  <Input
                    size="small"
                    {...inputProps}
                    defaultValue={report.project?.name}
                  />
                </FormItemStyled>
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
              </Wrapper>
              {isGoing && (
                <Wrapper>
                  <FormItemStyled
                    label="Progress"
                    name="today_progress"
                    style={{
                      marginTop: 0,
                    }}
                  >
                    {report.today_progress} % today
                  </FormItemStyled>

                  <FormItemStyled
                    name="tomorrow_progress"
                    style={{
                      marginTop: 0,
                    }}
                  >
                    {report.tomorrow_progress} % tomorrow
                  </FormItemStyled>
                </Wrapper>
              )}
              {isTimesheet && (
                <Wrapper>
                  <FormItemStyled
                    label="Worklog"
                    name="today_hour"
                    style={{
                      marginTop: 0,
                    }}
                  >
                    {report.today_hour} h today
                  </FormItemStyled>
                  <FormItemStyled
                    style={{
                      marginTop: 0,
                    }}
                    name="tomorrow_hour"
                  >
                    {report.tomorrow_hour} h tomorrow
                  </FormItemStyled>
                </Wrapper>
              )}
              <Wrapper>
                <FormItemStyled label="Assignee" name="assignee">
                  {report?.assignee?.name}
                </FormItemStyled>
              </Wrapper>
              <Wrapper>
                <FormItemStyled label="Member" name="employee">
                  {report.employee.name}
                </FormItemStyled>
              </Wrapper>
            </WrapperItem>
          </div>
        ))}
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 30px;
`;

const WrapperItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-bottom: 8px;
  padding: 12px;
`;

const FormItemStyled = styled(Form.Item)`
  width: 100%;
`;

export default TimesheetItem;
