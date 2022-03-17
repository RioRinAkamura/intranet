import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Form, Input, InputProps, Select } from 'antd';
import Button from 'app/components/Button';
import React from 'react';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

interface ReportItemProps {
  isCreate?: boolean;
  isEdit?: boolean;
  isView?: boolean;
  employeeId: string;
  fields?: any;
  name?: any;
  remove?: any;
  projectList?: any[];
  doneArr?: any[];
  timesheetDate?: any;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const Done = ({
  isCreate,
  isView,
  isEdit,
  employeeId,
  projectList,
}: ReportItemProps) => {
  const defaultReportValue = {
    id: null,
    employee_id: employeeId,
    project_id: null,
    reference: null,
    date: null,
    type: null,
    description: null,
    today_hour: 0,
    tomorrow_hour: 0,
    today_progress: 0,
    tomorrow_progress: 0,
  };

  const handleTaskClick = (taskLink, restField) => {
    console.log('taskLink', taskLink);
    console.log('restField', restField);
    // const win = window.open(`${taskLink}`, '_blank');
    // if (win) {
    //   win.focus();
    // }
  };

  return (
    <Form.List name="done">
      {(fields, { add, remove }) => (
        <>
          <div>
            {fields.map(({ key, name, ...restField }) => (
              <WrapperItem key={key}>
                <Wrapper>
                  <FormItemStyled
                    label="Task"
                    {...restField}
                    name={[name, 'reference']}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      type="text"
                      size="small"
                      placeholder="Task link..."
                    />
                  </FormItemStyled>
                  <IconWrapper>
                    <QuestionCircleFilled
                      style={{
                        fontSize: 18,
                        paddingTop: 4,
                        margin: 6,
                      }}
                      onClick={() => handleTaskClick(name, restField)}
                    />
                  </IconWrapper>
                </Wrapper>

                <Wrapper>
                  <FormItemStyled
                    label="Project"
                    {...restField}
                    name={[name, 'project_id']}
                  >
                    {isView ? (
                      <Input {...inputProps} />
                    ) : (
                      <StyledSelect size="small" placeholder="Select project">
                        {projectList &&
                          projectList.map(project => (
                            <Option
                              key={project.project.id}
                              value={project.project.id}
                            >
                              {project.project.name}
                            </Option>
                          ))}
                      </StyledSelect>
                    )}
                  </FormItemStyled>
                  <IconWrapper>
                    <QuestionCircleFilled
                      style={{
                        fontSize: 18,
                        paddingTop: 4,
                        margin: 6,
                      }}
                    />
                  </IconWrapper>
                </Wrapper>
                <Wrapper>
                  <FormItemStyled
                    label="Note"
                    {...restField}
                    name={[name, 'description']}
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    {isView ? (
                      <Input {...inputProps} />
                    ) : (
                      <TextArea
                        size="small"
                        rows={3}
                        placeholder="Description..."
                      />
                    )}
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
                <div style={{ textAlign: 'right' }}>
                  {isCreate || isEdit ? (
                    <IconWrapper>
                      <MinusSquareFilled
                        style={{
                          color: 'red',
                          paddingTop: 30,
                          fontSize: 24,
                          textAlign: 'right',
                        }}
                        onClick={() => remove(name)}
                      />
                    </IconWrapper>
                  ) : (
                    ''
                  )}
                </div>
              </WrapperItem>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isCreate || isEdit ? (
              <Button
                size="small"
                type="primary"
                onClick={() => add(defaultReportValue)}
              >
                + Add
              </Button>
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </Form.List>
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

const StyledSelect = styled(Select)`
  width: 100%;
`;

export default Done;
