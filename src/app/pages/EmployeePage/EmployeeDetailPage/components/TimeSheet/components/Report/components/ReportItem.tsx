import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Form, FormInstance, Input, InputProps, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import { useHandleEmployeeTimesheets } from '../../../useHandleEmployeeTimesheets';

const { Option } = Select;
const { TextArea } = Input;

interface ReportItemProps {
  form?: FormInstance;
  isCreate?: boolean;
  isEdit?: boolean;
  isView?: boolean;
  employeeId: string;
  fields?: any;
  name?: any;
  remove?: any;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const ReportItem = ({
  form,
  isCreate,
  isView,
  isEdit,
  employeeId,
  fields,
  name,
  remove,
}: ReportItemProps) => {
  const { employeeReports } = useHandleEmployeeTimesheets();
  const [projectList, setProjectList] = useState<any[]>([]);

  const fetchEmployeeProject = useCallback(async () => {
    const response = await api.hr.employee.project.list(employeeId);
    setProjectList(response.results);
  }, [employeeId]);

  useEffect(() => {
    fetchEmployeeProject();
  }, [fetchEmployeeProject]);

  const handleTaskClick = taskLink => {
    const win = window.open(`${taskLink}`, '_blank');
    if (win) {
      win.focus();
    }
  };

  return (
    <Form form={form}>
      {employeeReports.results &&
        employeeReports.results.map(report => (
          <div key={report.id}>
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
                      defaultValue={
                        !isCreate && report.type === '2' ? report.reference : ''
                      }
                    />
                  </FormItemStyled>
                  <IconWrapper>
                    <QuestionCircleFilled
                      style={{
                        fontSize: 18,
                        paddingTop: 4,
                        margin: 6,
                      }}
                      onClick={() => handleTaskClick(report.reference)}
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
                      <Input
                        {...inputProps}
                        defaultValue={
                          report.type === '2' ? report?.project?.name : ''
                        }
                      />
                    ) : (
                      <StyledSelect
                        size="small"
                        placeholder="Select project"
                        defaultValue={
                          !isCreate && report.type === '2'
                            ? report?.project?.name
                            : ''
                        }
                      >
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
                      <Input
                        {...inputProps}
                        defaultValue={
                          report.type === '2' ? report.description : ''
                        }
                      />
                    ) : (
                      <TextArea
                        size="small"
                        rows={3}
                        placeholder="Description..."
                        defaultValue={
                          !isCreate && report.type === '2'
                            ? report.description
                            : ''
                        }
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
        ))}
    </Form>
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

export default ReportItem;
