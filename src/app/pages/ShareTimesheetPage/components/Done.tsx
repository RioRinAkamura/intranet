import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Report } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Form, FormInstance, Input, InputProps, Select } from 'antd';
import Button from 'app/components/Button';
import { DialogModal } from 'app/components/DialogModal';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

interface ReportItemProps {
  form?: FormInstance;
  reportList?: any[];
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const Done = ({ form, reportList }: ReportItemProps) => {
  const handleTaskClick = key => {
    const values = form?.getFieldValue('done');
    const link = values.map(value => value.reference);
    const win = window.open(`${link[key]}`, '_blank');
    if (win) {
      win.focus();
    }
  };
  const values = form?.getFieldValue('done');
  const projectName = values?.map(value => value?.project?.name);

  const handleProjectClick = key => {
    const values = form?.getFieldValue('done');
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
  justify-content: space-around;
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

export default Done;
