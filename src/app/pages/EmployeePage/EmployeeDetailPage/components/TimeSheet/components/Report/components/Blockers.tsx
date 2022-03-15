import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, InputProps, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import { useHandleEmployeeTimesheets } from '../../../useHandleEmployeeTimesheets';

const { Option } = Select;
const { TextArea } = Input;

interface ReportItemProps {
  form: FormInstance;
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

const Blockers = ({
  form,
  isCreate,
  isView,
  isEdit,
  employeeId,
  fields,
  name,
  remove,
}: ReportItemProps) => {
  const {
    employeeReports,
    fetchEmployeeReport,
  } = useHandleEmployeeTimesheets();
  const [projectList, setProjectList] = useState<any[]>([]);

  useEffect(() => {
    fetchEmployeeReport(employeeId);
  }, [fetchEmployeeReport, employeeId]);

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

  const fetchEmployeeProject = useCallback(async () => {
    const response = await api.hr.employee.project.list(employeeId);
    setProjectList(response.results);
  }, [employeeId]);

  useEffect(() => {
    fetchEmployeeProject();
  }, [fetchEmployeeProject]);

  return (
    <Form form={form}>
      <Form.List name="blockers">
        {(fields, { add, remove }) => (
          <>
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
                            size="small"
                            placeholder="Enter task link"
                            defaultValue={
                              !isCreate && report.type === '5'
                                ? report.reference
                                : ''
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
                                report.type === '5' ? report?.project?.name : ''
                              }
                            />
                          ) : (
                            <StyledSelect
                              size="small"
                              placeholder="Select project"
                              defaultValue={
                                !isCreate && report.type === '5'
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
                              {...(isView ? inputProps : {})}
                              defaultValue={
                                report.type === '5' ? report.description : ''
                              }
                            />
                          ) : (
                            <TextArea
                              size="small"
                              rows={3}
                              placeholder="Description..."
                              defaultValue={
                                !isCreate && report.type === '5'
                                  ? report.description
                                  : ''
                              }
                            ></TextArea>
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
            <div style={{ textAlign: 'right' }}>
              {isCreate || isEdit ? (
                <Button type="primary" onClick={() => add(defaultReportValue)}>
                  + Add
                </Button>
              ) : (
                ''
              )}
            </div>
          </>
        )}
      </Form.List>
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

export default Blockers;
