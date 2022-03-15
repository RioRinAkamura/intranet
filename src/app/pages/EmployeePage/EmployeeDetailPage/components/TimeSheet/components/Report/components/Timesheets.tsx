import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, InputProps, Select } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  timesheetItems?: any;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const Timesheets = ({
  form,
  isCreate,
  isView,
  isEdit,
  employeeId,
  fields,
  name,
  remove,
  timesheetItems,
}: ReportItemProps) => {
  const {
    employeeReports,
    fetchEmployeeReport,
  } = useHandleEmployeeTimesheets();
  const [projectList, setProjectList] = useState<any[]>([]);

  const inputRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current = timesheetItems.map(item => item.reference);
  }, [inputRef, timesheetItems]);

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

  // const handleTaskClick = taskLink => {
  //   const win = window.open(`${taskLink}`, '_blank');
  //   if (win) {
  //     win.focus();
  //   }
  // };

  return (
    <Form form={form}>
      <Form.List name="timesheets">
        {(fields, { add, remove }) => (
          <>
            {isCreate ? (
              <>
                {timesheetItems &&
                  timesheetItems.map(timesheet => (
                    <div key={timesheet.id}>
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
                                // ref={inputRef}
                                {...(isView ? inputProps : {})}
                                size="small"
                                placeholder="Task link..."
                                defaultValue={timesheet.reference}
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
                                <Input {...inputProps} />
                              ) : (
                                <StyledSelect
                                  size="small"
                                  placeholder="Select project"
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
                                <Input {...inputProps} />
                              ) : (
                                <TextArea
                                  size="small"
                                  rows={3}
                                  placeholder="Description..."
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
                          <Wrapper>
                            <FormItemStyled
                              label="Progress"
                              {...restField}
                              style={{
                                marginTop: isCreate || isEdit ? 40 : 0,
                                width: '44%',
                              }}
                              name={[name, 'today_hour']}
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                              ]}
                            >
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={24}
                                min={0}
                                defaultValue={
                                  !isCreate && timesheet.type === '1'
                                    ? timesheet.today_hour
                                    : 0
                                }
                              />
                            </FormItemStyled>
                            <span
                              style={{
                                marginTop: isCreate || isEdit ? 44 : 0,
                                width: '18%',
                              }}
                            >
                              h today
                            </span>
                            <FormItemStyled
                              {...restField}
                              style={{
                                marginTop: isCreate || isEdit ? 40 : 0,
                                width: '18%',
                              }}
                              name={[name, 'tomorrow_hour']}
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                              ]}
                            >
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={24}
                                min={0}
                                defaultValue={
                                  !isCreate && timesheet.type === '1'
                                    ? timesheet.tomorrow_hour
                                    : 0
                                }
                              />
                            </FormItemStyled>
                            <span
                              style={{
                                marginTop: isCreate || isEdit ? 44 : 0,
                                width: '30%',
                              }}
                            >
                              h tomorrow
                            </span>
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
              </>
            ) : (
              <>
                {employeeReports.results &&
                  employeeReports.results.map(timesheet => (
                    <div key={timesheet.id}>
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
                                ref={inputRef.current}
                                {...(isView ? inputProps : {})}
                                size="small"
                                placeholder="Task link..."
                                defaultValue={
                                  !isCreate && timesheet.type === '1'
                                    ? timesheet.description
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
                                    timesheet.type === '1'
                                      ? timesheet?.project?.name
                                      : ''
                                  }
                                />
                              ) : (
                                <StyledSelect
                                  size="small"
                                  placeholder="Select project"
                                  defaultValue={
                                    !isCreate && timesheet.type === '1'
                                      ? timesheet?.project?.name
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
                                    timesheet.type === '1'
                                      ? timesheet?.description
                                      : ''
                                  }
                                />
                              ) : (
                                <TextArea
                                  size="small"
                                  rows={3}
                                  placeholder="Description..."
                                  defaultValue={
                                    !isCreate && timesheet.type === '1'
                                      ? timesheet.description
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
                          <Wrapper>
                            <FormItemStyled
                              label="Progress"
                              {...restField}
                              style={{
                                marginTop: isCreate || isEdit ? 40 : 0,
                                width: '44%',
                              }}
                              name={[name, 'today_hour']}
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                              ]}
                            >
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={24}
                                min={0}
                                defaultValue={
                                  !isCreate && timesheet.type === '1'
                                    ? timesheet.today_hour
                                    : 0
                                }
                              />
                            </FormItemStyled>
                            <span
                              style={{
                                marginTop: isCreate || isEdit ? 44 : 0,
                                width: '18%',
                              }}
                            >
                              h today
                            </span>
                            <FormItemStyled
                              {...restField}
                              style={{
                                marginTop: isCreate || isEdit ? 40 : 0,
                                width: '18%',
                              }}
                              name={[name, 'tomorrow_hour']}
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                              ]}
                            >
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={24}
                                min={0}
                                defaultValue={
                                  !isCreate && timesheet.type === '1'
                                    ? timesheet.tomorrow_hour
                                    : 0
                                }
                              />
                            </FormItemStyled>
                            <span
                              style={{
                                marginTop: isCreate || isEdit ? 44 : 0,
                                width: '30%',
                              }}
                            >
                              h tomorrow
                            </span>
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
              </>
            )}
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

export default Timesheets;
