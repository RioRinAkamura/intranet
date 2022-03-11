import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Input, InputProps, Select } from 'antd';
import config from 'config';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { api } from 'utils/api';
import { useHandleEmployeeTimesheets } from '../useHandleEmployeeTimesheets';

const { Option } = Select;
const { TextArea } = Input;

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};
interface TimeSheetProps {
  employeeId: string;
  isView: boolean;
  isEdit: boolean;
  isCreate: boolean;
}

type FormValues = {
  date: string;
  done: [{ reference: string; project: string; description: string }];
  going: [
    {
      reference: string;
      project: string;
      description: string;
      today_progress: number;
      tomorrow_progress: number;
    },
  ];
  blockers: [{ reference: string; project: string; description: string }];
  issues: [{ reference: string; project: string; description: string }];
  todo: [{ reference: string; project: string; description: string }];
  others: [{ reference: string; project: string; description: string }];
  timesheets: [
    {
      reference: string;
      description: string;
      project: string;
      today_hour: number;
      tomorrow_hour: number;
    },
  ];
};

const TimeSheetModal = memo(
  ({ employeeId, isCreate, isEdit, isView }: TimeSheetProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [projectList, setProjectList] = useState<any[]>([]);

    const DATE_FORMAT = config.DATE_FORMAT;
    const disabledDate = (current: moment.Moment) => {
      return current > moment().endOf('day');
    };
    const today = new Date();

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<any>({
      defaultValues: {
        formValues: [
          {
            done: [{ reference: '', project: '', description: '' }],
            going: [
              {
                reference: '',
                project: '',
                description: '',
                today_progress: 0,
                tomorrow_progress: 0,
              },
            ],
            blockers: [{ reference: '', project: '', description: '' }],
            issues: [{ reference: '', project: '', description: '' }],

            todo: [{ reference: '', project: '', description: '' }],

            others: [{ reference: '', project: '', description: '' }],
            timesheets: [
              {
                reference: '',
                project: '',
                description: '',
                today_hour: 0,
                tomorrow_hour: 0,
              },
            ],
          },
        ] as any,
      },
    });

    let renderCount = 0;

    const {
      fields: doneFields,
      append: doneAppend,
      remove: doneRemove,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    const {
      fields: fieldsGoing,
      append: appendGoing,
      remove: removeGoing,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    const {
      fields: fieldsBlockers,
      append: appendBlockers,
      remove: removeBlockers,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    const {
      fields: fieldsIssues,
      append: appendIssues,
      remove: removeIssues,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    const {
      fields: fieldsTodo,
      append: appendTodo,
      remove: removeTodo,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    const {
      fields: fieldsOthers,
      append: appendOthers,
      remove: removeOthers,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    const {
      fields: fieldsTimesheets,
      append: appendTimesheets,
      remove: removeTimesheets,
    } = useFieldArray({
      name: 'formValues',
      control,
    });

    renderCount++;

    const onSubmit = data => {
      console.log('data report', data);
    };

    const handleDecline = () => {
      console.log('decline');
      reset({
        formValues: [
          {
            done: [{ reference: '', project: '', description: '' }],
            going: [
              {
                reference: '',
                project: '',
                description: '',
                today_progress: 0,
                tomorrow_progress: 0,
              },
            ],
            blockers: [{ reference: '', project: '', description: '' }],
            issues: [{ reference: '', project: '', description: '' }],

            todo: [{ reference: '', project: '', description: '' }],

            others: [{ reference: '', project: '', description: '' }],
            timesheets: [
              {
                reference: '',
                project: '',
                description: '',
                today_hour: 0,
                tomorrow_hour: 0,
              },
            ],
          },
        ],
      });
    };

    const handleApprove = () => {
      console.log('approve');
    };

    const handleToggle = () => {};

    const {
      employeeReports,
      fetchEmployeeReport,
      loading,
      addEmployeeReport,
      editEmployeeReport,
      deleteEmployeeReport,
    } = useHandleEmployeeTimesheets();

    const fetchEmployeeProject = useCallback(async () => {
      const response = await api.hr.employee.project.list(employeeId);
      setProjectList(response.results);
    }, [employeeId]);

    useEffect(() => {
      fetchEmployeeProject();
      fetchEmployeeReport(employeeId);
    }, [fetchEmployeeProject, fetchEmployeeReport, employeeId]);

    const handleReportSubmit = () => {
      setIsSubmit(true);
    };

    const handleTaskClick = () => {
      const win = window.open(``, '_blank');
      if (win) {
        win.focus();
      }
    };

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ModalContentWrapper>
              <div>
                Date:
                <StyledDatePicker
                  {...register('date')}
                  format={DATE_FORMAT}
                  disabledDate={disabledDate}
                  defaultValue={moment(today, DATE_FORMAT)}
                  style={{ marginLeft: 12 }}
                  allowClear={false}
                />
              </div>
              <div>
                <Button
                  type="default"
                  style={{ marginRight: '12px' }}
                  onClick={handleToggle}
                >
                  {isView ? 'Edit' : 'Preview'}
                </Button>
                <ButtonStyled type="submit">Submit</ButtonStyled>
                <Button
                  danger
                  type="primary"
                  style={{ margin: '0px 12px' }}
                  onClick={handleDecline}
                >
                  Decline
                </Button>
                <Button type="primary" onClick={handleApprove}>
                  Approve
                </Button>
              </div>
            </ModalContentWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <WrapperReportItem>
                <h3>Report</h3>
                {/* DONE */}
                <>
                  <h3>DONE</h3>
                  {employeeReports.results &&
                    employeeReports.results.map((report, index) => {
                      return (
                        <div key={report.id}>
                          {doneFields.map((field, index) => {
                            return (
                              <WrapperItem key={field.id}>
                                <Wrapper>
                                  <FormItemStyled>
                                    <Label>Task: </Label>
                                    <Input
                                      {...(isView ? inputProps : {})}
                                      size="small"
                                      placeholder="Enter task link"
                                      {...register(
                                        `done[${index}].reference` as const,
                                      )}
                                      defaultValue={
                                        !isCreate && report.type === '2'
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
                                      onClick={handleTaskClick}
                                    />
                                  </IconWrapper>
                                </Wrapper>
                                <Wrapper>
                                  <FormItemStyled>
                                    <Label>Project: </Label>
                                    {isView ? (
                                      <Input
                                        {...inputProps}
                                        defaultValue={
                                          report.type === '2'
                                            ? report?.project?.name
                                            : ''
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
                                              key={project.id}
                                              value={project.id}
                                              {...register(
                                                `done[${index}].project` as const,
                                              )}
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
                                  <FormItemStyled>
                                    <Label>Note: </Label>
                                    {isView ? (
                                      <Input
                                        {...(isView ? inputProps : {})}
                                        defaultValue={
                                          report.type === '2'
                                            ? report.description
                                            : ''
                                        }
                                      />
                                    ) : (
                                      <TextArea
                                        size="small"
                                        rows={3}
                                        placeholder="Description..."
                                        style={{ marginTop: '40px' }}
                                        {...register(
                                          `done[${index}].description` as any,
                                        )}
                                        defaultValue={
                                          !isCreate && report.type === '2'
                                            ? report.description
                                            : ''
                                        }
                                      >
                                        {!isCreate && report.type === '2'
                                          ? report.description
                                          : ''}
                                      </TextArea>
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
                                <Wrapper> {''}</Wrapper>
                                {!isView && (
                                  <div style={{ textAlign: 'right' }}>
                                    <IconWrapper>
                                      <MinusSquareFilled
                                        disabled={isView ? true : false}
                                        style={{
                                          color: 'red',
                                          fontSize: 24,
                                          textAlign: 'right',
                                          padding: '0px 8px 8px 0px',
                                        }}
                                        onClick={() => doneRemove(index)}
                                      />
                                    </IconWrapper>
                                  </div>
                                )}
                              </WrapperItem>
                            );
                          })}
                        </div>
                      );
                    })}
                  {!isView && (
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          doneAppend({});
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </>
                <>
                  <h3>GOING</h3>

                  {employeeReports.results &&
                    employeeReports.results.map((report, index) => (
                      <div key={report.id}>
                        {fieldsGoing.map((field, index) => (
                          <WrapperItem key={field.id}>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Task: </Label>
                                <Input
                                  {...(isView ? inputProps : {})}
                                  size="small"
                                  placeholder="Enter task link"
                                  {...register(
                                    `going[${index}].reference` as const,
                                  )}
                                  defaultValue={
                                    !isCreate && report.type === '3'
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
                                  onClick={handleTaskClick}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Project: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '3'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  />
                                ) : (
                                  <StyledSelect
                                    size="small"
                                    placeholder="Select project"
                                    defaultValue={
                                      !isCreate && report.type === '3'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  >
                                    {projectList &&
                                      projectList.map(project => (
                                        <Option
                                          key={project.id}
                                          value={project.id}
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
                              <FormItemStyled>
                                <Label>Note: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '3'
                                        ? report.description
                                        : ''
                                    }
                                  />
                                ) : (
                                  <TextArea
                                    size="small"
                                    rows={3}
                                    placeholder="Description..."
                                    style={{ marginTop: '40px' }}
                                    {...register(
                                      `going[${index}].description` as const,
                                    )}
                                    defaultValue={
                                      !isCreate && report.type === '3'
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
                                    paddingTop: 4,
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <WrapperProgress>
                              <Label>Progress: </Label>
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={100}
                                min={0}
                                {...register(
                                  `going[${index}].today_progress` as const,
                                )}
                                defaultValue={
                                  !isCreate && report.type === '3'
                                    ? report.today_progress
                                    : ''
                                }
                              />
                              % today
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={100}
                                min={0}
                                {...register(
                                  `going[${index}].tomorrow_progress` as const,
                                )}
                                defaultValue={
                                  !isCreate && report.type === '3'
                                    ? report.tomorrow_progress
                                    : ''
                                }
                              />
                              % tomorrow
                            </WrapperProgress>
                            {!isView && (
                              <div style={{ textAlign: 'right' }}>
                                <IconWrapper>
                                  <MinusSquareFilled
                                    style={{
                                      color: 'red',
                                      fontSize: 24,
                                      textAlign: 'right',
                                      padding: '0px 8px 8px 0px',
                                    }}
                                    onClick={() => removeGoing(index)}
                                  />
                                </IconWrapper>
                              </div>
                            )}
                          </WrapperItem>
                        ))}
                      </div>
                    ))}

                  {!isView && (
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          appendGoing({ reference: '', description: '' });
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </>
                {/* BLOCKERS */}
                <>
                  <h3>BLOCKERS</h3>
                  {employeeReports.results &&
                    employeeReports.results.map((report, index) => (
                      <div key={report.id}>
                        {fieldsBlockers.map((field, index) => (
                          <WrapperItem key={field.id}>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Task: </Label>
                                <Input
                                  {...(isView ? inputProps : {})}
                                  size="small"
                                  placeholder="Enter task link"
                                  {...register(
                                    `blockers[${index}].reference` as const,
                                  )}
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
                                  onClick={handleTaskClick}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Project: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '5'
                                        ? report?.project?.name
                                        : ''
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
                                          key={project.id}
                                          value={project.id}
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
                              <FormItemStyled>
                                <Label>Note: </Label>
                                {isView ? (
                                  <Input
                                    {...(isView ? inputProps : {})}
                                    defaultValue={
                                      report.type === '5'
                                        ? report.description
                                        : ''
                                    }
                                  />
                                ) : (
                                  <TextArea
                                    size="small"
                                    rows={3}
                                    placeholder="Description..."
                                    style={{ marginTop: '40px' }}
                                    {...register(
                                      `blockers[${index}].description` as const,
                                    )}
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
                                    paddingTop: 4,
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper> {''}</Wrapper>
                            {!isView && (
                              <div style={{ textAlign: 'right' }}>
                                <IconWrapper>
                                  <MinusSquareFilled
                                    style={{
                                      color: 'red',
                                      fontSize: 24,
                                      textAlign: 'right',
                                      padding: '0px 8px 8px 0px',
                                    }}
                                    onClick={() => removeBlockers(index)}
                                  />
                                </IconWrapper>
                              </div>
                            )}
                          </WrapperItem>
                        ))}
                      </div>
                    ))}
                  {!isView && (
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          appendBlockers({ reference: '', description: '' });
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </>
                {/* ISSUES */}
                <>
                  <h3>ISSUES</h3>
                  {employeeReports.results &&
                    employeeReports.results.map((report, index) => (
                      <div key={report.id}>
                        {fieldsIssues.map((field, index) => (
                          <WrapperItem key={field.id}>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Task: </Label>
                                <Input
                                  {...(isView ? inputProps : {})}
                                  size="small"
                                  placeholder="Enter task link"
                                  {...register(
                                    `issues[${index}].reference` as const,
                                  )}
                                  defaultValue={
                                    !isCreate && report.type === '4'
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
                                  onClick={handleTaskClick}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Project: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '4'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  />
                                ) : (
                                  <StyledSelect
                                    size="small"
                                    placeholder="Select project"
                                    defaultValue={
                                      !isCreate && report.type === '4'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  >
                                    {projectList &&
                                      projectList.map(project => (
                                        <Option
                                          key={project.id}
                                          value={project.id}
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
                              <FormItemStyled>
                                <Label>Note: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '4'
                                        ? report.description
                                        : ''
                                    }
                                  />
                                ) : (
                                  <TextArea
                                    size="small"
                                    rows={3}
                                    placeholder="Description..."
                                    style={{ marginTop: '40px' }}
                                    {...register(
                                      `issues[${index}].description` as const,
                                    )}
                                    defaultValue={
                                      report.type === '4'
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
                                    paddingTop: 4,
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper> {''}</Wrapper>
                            {!isView && (
                              <div style={{ textAlign: 'right' }}>
                                <IconWrapper>
                                  <MinusSquareFilled
                                    style={{
                                      color: 'red',
                                      fontSize: 24,
                                      textAlign: 'right',
                                      padding: '0px 8px 8px 0px',
                                    }}
                                    onClick={() => removeIssues(index)}
                                  />
                                </IconWrapper>
                              </div>
                            )}
                          </WrapperItem>
                        ))}
                      </div>
                    ))}
                  {!isView && (
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          appendIssues({ reference: '', description: '' });
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </>
                {/* TODO */}
                <>
                  <h3>TODO</h3>
                  {employeeReports.results &&
                    employeeReports.results.map((report, index) => (
                      <div key={report.id}>
                        {fieldsTodo.map((field, index) => (
                          <WrapperItem key={field.id}>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Task: </Label>
                                <Input
                                  {...(isView ? inputProps : {})}
                                  size="small"
                                  placeholder="Enter task link"
                                  {...register(
                                    `todo[${index}].reference` as const,
                                  )}
                                  defaultValue={
                                    !isCreate && report.type === '6'
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
                                  onClick={handleTaskClick}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Project: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '6'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  />
                                ) : (
                                  <StyledSelect
                                    size="small"
                                    placeholder="Select project"
                                    defaultValue={
                                      !isCreate && report.type === '6'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  >
                                    {projectList &&
                                      projectList.map(project => (
                                        <Option
                                          key={project.id}
                                          value={project.id}
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
                              <FormItemStyled>
                                <Label>Note: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '6'
                                        ? report.description
                                        : ''
                                    }
                                  />
                                ) : (
                                  <TextArea
                                    size="small"
                                    rows={3}
                                    placeholder="Description..."
                                    style={{ marginTop: '40px' }}
                                    {...register(
                                      `todo[${index}].description` as const,
                                    )}
                                    defaultValue={
                                      !isCreate && report.type === '6'
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
                                    paddingTop: 4,
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper> {''}</Wrapper>
                            {!isView && (
                              <div style={{ textAlign: 'right' }}>
                                <IconWrapper>
                                  <MinusSquareFilled
                                    style={{
                                      color: 'red',
                                      fontSize: 24,
                                      textAlign: 'right',
                                      padding: '0px 8px 8px 0px',
                                    }}
                                    onClick={() => removeTodo(index)}
                                  />
                                </IconWrapper>
                              </div>
                            )}
                          </WrapperItem>
                        ))}
                      </div>
                    ))}
                  {!isView && (
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          appendTodo({ reference: '', description: '' });
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </>
                {/* OTHER */}
                <>
                  <h3>OTHER</h3>
                  {employeeReports.results &&
                    employeeReports.results.map((report, index) => (
                      <div key={report.id}>
                        {fieldsOthers &&
                          fieldsOthers.map((field, index) => (
                            <WrapperItem key={field.id}>
                              <Wrapper>
                                <FormItemStyled>
                                  <Label>Task: </Label>
                                  <Input
                                    {...(isView ? inputProps : {})}
                                    size="small"
                                    placeholder="Enter task link"
                                    {...register(
                                      `others[${index}].reference` as const,
                                    )}
                                    defaultValue={
                                      !isCreate && report.type === '7'
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
                                    onClick={handleTaskClick}
                                  />
                                </IconWrapper>
                              </Wrapper>
                              <Wrapper>
                                <FormItemStyled>
                                  <Label>Project: </Label>
                                  {isView ? (
                                    <Input
                                      {...inputProps}
                                      defaultValue={
                                        report.type === '7'
                                          ? report?.project?.name
                                          : ''
                                      }
                                    />
                                  ) : (
                                    <StyledSelect
                                      size="small"
                                      placeholder="Select project"
                                      defaultValue={
                                        !isCreate && report.type === '7'
                                          ? report?.project?.name
                                          : ''
                                      }
                                    >
                                      {projectList &&
                                        projectList.map(project => (
                                          <Option
                                            key={project.id}
                                            value={project.id}
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
                                <FormItemStyled>
                                  <Label>Note: </Label>
                                  {isView ? (
                                    <Input
                                      {...inputProps}
                                      defaultValue={
                                        report.type === '7'
                                          ? report.description
                                          : ''
                                      }
                                    />
                                  ) : (
                                    <TextArea
                                      size="small"
                                      rows={3}
                                      placeholder="Description..."
                                      style={{ marginTop: '40px' }}
                                      {...register(
                                        `others[${index}].description` as const,
                                      )}
                                      defaultValue={
                                        !isCreate && report.type === '7'
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
                                      paddingTop: 4,
                                      margin: 6,
                                    }}
                                  />
                                </IconWrapper>
                              </Wrapper>
                              <Wrapper> {''}</Wrapper>
                              {!isView && (
                                <div style={{ textAlign: 'right' }}>
                                  <IconWrapper>
                                    <MinusSquareFilled
                                      style={{
                                        color: 'red',
                                        fontSize: 24,
                                        textAlign: 'right',
                                        padding: '0px 8px 8px 0px',
                                      }}
                                      onClick={() => removeOthers(index)}
                                    />
                                  </IconWrapper>
                                </div>
                              )}
                            </WrapperItem>
                          ))}
                      </div>
                    ))}
                  {!isView && (
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          appendOthers({ reference: '', description: '' });
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </>
              </WrapperReportItem>

              {/* TIMESHEET */}
              <WrapperReportItem>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h3>Timesheet</h3>
                  <Button type="primary" style={{ marginBottom: 12 }}>
                    Sync
                  </Button>
                </div>
                {employeeReports.results &&
                  employeeReports.results.map((report, index) => (
                    <div key={report.id}>
                      {fieldsTimesheets &&
                        fieldsTimesheets.map((field, index) => (
                          <WrapperItem key={field.id}>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Task: </Label>
                                <Input
                                  {...(isView ? inputProps : {})}
                                  size="small"
                                  placeholder="Enter task link"
                                  {...register(
                                    `timesheets[${index}].reference` as const,
                                  )}
                                  defaultValue={
                                    !isCreate && report.type === '1'
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
                                  onClick={handleTaskClick}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper>
                              <FormItemStyled>
                                <Label>Project: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '1'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  />
                                ) : (
                                  <StyledSelect
                                    size="small"
                                    placeholder="Select project"
                                    defaultValue={
                                      !isCreate && report.type === '1'
                                        ? report?.project?.name
                                        : ''
                                    }
                                  >
                                    {projectList &&
                                      projectList.map(project => (
                                        <Option
                                          key={project.id}
                                          value={project.id}
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
                              <FormItemStyled>
                                <Label>Note: </Label>
                                {isView ? (
                                  <Input
                                    {...inputProps}
                                    defaultValue={
                                      report.type === '1'
                                        ? report?.description
                                        : ''
                                    }
                                  />
                                ) : (
                                  <TextArea
                                    size="small"
                                    rows={3}
                                    placeholder="Description..."
                                    style={{ marginTop: '40px' }}
                                    {...register(
                                      `timesheets[${index}].description` as const,
                                    )}
                                    defaultValue={
                                      !isCreate && report.type === '1'
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
                                    paddingTop: 4,
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <WrapperProgress>
                              <Label>Spent: </Label>
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={100}
                                min={0}
                                {...register(
                                  `timesheets[${index}].today_hour` as const,
                                )}
                                defaultValue={
                                  !isCreate && report.type === '1'
                                    ? report.today_hour
                                    : ''
                                }
                              />
                              h today
                              <StyledInputProgress
                                {...(isView ? inputProps : {})}
                                size="small"
                                type="number"
                                max={100}
                                min={0}
                                {...register(
                                  `timesheets[${index}].tomorrow_hour` as const,
                                )}
                                defaultValue={
                                  !isCreate && report.type === '1'
                                    ? report.today_hour
                                    : ''
                                }
                              />
                              h tomorrow
                            </WrapperProgress>
                            {!isView && (
                              <div style={{ textAlign: 'right' }}>
                                <IconWrapper>
                                  <MinusSquareFilled
                                    style={{
                                      color: 'red',
                                      fontSize: 24,
                                      textAlign: 'right',
                                      padding: '0px 8px 8px 0px',
                                    }}
                                    onClick={() => removeTimesheets(index)}
                                  />
                                </IconWrapper>
                              </div>
                            )}
                          </WrapperItem>
                        ))}
                    </div>
                  ))}
                {!isView && (
                  <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        appendTimesheets({ reference: '', description: '' });
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                )}
              </WrapperReportItem>
            </div>
          </div>
        </form>
      </>
    );
  },
);

const IconWrapper = styled.span`
  cursor: pointer;
`;

const FormItemStyled = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
`;

const WrapperProgress = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 40px;
  margin-top: 36px;
`;

const WrapperReportItem = styled.div`
  width: 420px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 16px;
`;

const StyledInputProgress = styled(Input)`
  width: 50px;
  margin-left: 8px;
  margin-right: 8px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 12px;
`;

const Label = styled.span`
  display: block;
  width: 20%;
  margin-left: 8px;
`;

const WrapperItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-bottom: 8px;
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const ButtonStyled = styled.button`
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 3px;
  height: 72%;
  cursor: pointer;
  :hover {
    background-color: #188fffcc;
  }
`;

export default TimeSheetModal;
