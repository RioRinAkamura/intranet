import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputProps,
  Select,
  Divider,
} from 'antd';
import config from 'config';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import { useHandleEmployeeTimesheets } from '../../useHandleTimesheet';

const { Option } = Select;
const { TextArea } = Input;

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};
interface TimeSheetProps {
  employeeId: string;
  isCreate?: boolean;
  isEdit?: boolean;
  form?: FormInstance;
}

const Report = memo(
  ({ employeeId, isCreate, isEdit, form }: TimeSheetProps) => {
    const [isView, setIsView] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [projectList, setProjectList] = useState<any[]>([]);
    const [reportId, setReportId] = useState<string[]>(['']);
    const [newData, setNewData] = useState<any[]>([]);

    const DATE_FORMAT = config.DATE_FORMAT;
    const disabledDate = (current: moment.Moment) => {
      return current > moment().endOf('day');
    };
    const today = new Date();

    const handleDecline = () => {
      console.log('decline');
    };
    const handleApprove = () => {
      console.log('approve');
    };

    const handleToggle = () => {
      setIsView(!isView);
    };

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

    useEffect(() => {
      setReportId(employeeReports.results.map(report => report.id));
    }, [employeeReports]);

    const handleReportSubmit = () => {
      setIsSubmit(true);
    };

    const handleTaskClick = taskLink => {
      const win = window.open(`${taskLink}`, '_blank');
      if (win) {
        win.focus();
      }
    };

    const onFinish = values => {
      console.log('Received values of form:', values);
      const doneList = [...values.done];
      const goingList = [...values.going];
      const blockerList = [...values.blockers];
      const issueList = [...values.issues];
      const todoList = [...values.todo];
      const otherList = [...values.others];
      // const timesheetList = [...values.timesheet];

      let newDataArr: any[] = [];

      if (doneList) {
        const doneData = doneList.map(value => {
          return {
            id: '',
            employee_id: employeeId,
            project_id: value.project ? value.project.id : null,
            reference: value.reference,
            date: value.date,
            type: '2',
            description: value.description,
            today_progress: null,
            tomorrow_progress: null,
          };
        });
        newDataArr = [...newDataArr, doneData];
      }

      if (goingList) {
        const goingData = goingList.map(value => {
          return {
            id: '',
            employee_id: employeeId,
            project_id: value.project ? value.project.id : null,
            reference: value.reference,
            date: value.date,
            type: '3',
            description: value.description,
            today_progress: null,
            tomorrow_progress: null,
          };
        });
        newDataArr = [...newDataArr, goingData];
      }

      if (blockerList) {
        const blockerData = blockerList.map(value => {
          return {
            id: '',
            employee_id: employeeId,
            project_id: value.project ? value.project.id : null,
            reference: value.reference,
            date: value.date,
            type: '5',
            description: value.description,
            today_progress: null,
            tomorrow_progress: null,
          };
        });
        newDataArr = [...newDataArr, blockerData];
      }

      if (issueList) {
        const issueData = issueList.map(value => {
          return {
            id: '',
            employee_id: employeeId,
            project_id: value.project ? value.project.id : null,
            reference: value.reference,
            date: value.date,
            type: '4',
            description: value.description,
            today_progress: null,
            tomorrow_progress: null,
          };
        });
        newDataArr = [...newDataArr, issueData];
      }

      if (todoList) {
        const todoData = todoList.map(value => {
          return {
            id: '',
            employee_id: employeeId,
            project_id: value.project ? value.project.id : null,
            reference: value.reference,
            date: value.date,
            type: '6',
            description: value.description,
            today_progress: null,
            tomorrow_progress: null,
          };
        });
        newDataArr = [...newDataArr, todoData];
      }

      if (otherList) {
        const otherData = otherList.map(value => {
          return {
            id: '',
            employee_id: employeeId,
            project_id: value.project ? value.project.id : null,
            reference: value.reference,
            date: value.date,
            type: '7',
            description: value.description,
            today_progress: null,
            tomorrow_progress: null,
          };
        });
        newDataArr = [...newDataArr, otherData];
      }

      console.log('newDataArr TOTAL', newDataArr);

      // dispatch(
      //   actions.({
      //     ...form.getFieldsValue(),
      //     employee: employeeId,
      //     date: moment(form.getFieldsValue().date).format(DATE_FORMAT),
      //   }),
      // );
    };

    return (
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item name="date">
          <ModalContentWrapper>
            <div>
              Date:
              <StyledDatePicker
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
        </Form.Item>
        <ModalContentWrapper>
          <WrapperReportItem>
            <h3>Report</h3>
            <>
              <h3>DONE</h3>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="done" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                  placeholder="Task link..."
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
                                  onClick={() =>
                                    handleTaskClick(report.reference)
                                  }
                                />
                              </IconWrapper>
                            </Wrapper>

                            <Wrapper>
                              <FormItemStyled
                                label="Project"
                                {...restField}
                                name={[name, 'project']}
                              >
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
            <Divider />
            <>
              <h3>GOING</h3>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="going" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                />
                              </IconWrapper>
                            </Wrapper>

                            <Wrapper>
                              <FormItemStyled
                                label="Project"
                                {...restField}
                                name={[name, 'project']}
                              >
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
                                    defaultValue={
                                      !isCreate && report.type === '3'
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
                            <Wrapper>
                              <FormItemStyled
                                style={{ marginTop: 40 }}
                                label="Progress"
                                {...restField}
                                name={[name, 'description']}
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
                                  max={100}
                                  min={0}
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
                                  defaultValue={
                                    !isCreate && report.type === '3'
                                      ? report.tomorrow_progress
                                      : ''
                                  }
                                />
                                % tomorrow
                              </FormItemStyled>
                            </Wrapper>
                            <div style={{ textAlign: 'right' }}>
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
            <Divider />
            <>
              <h3>BLOCKERS</h3>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="blockers" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                name={[name, 'project']}
                              >
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
            <Divider />
            <>
              <h3>ISSUES</h3>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="issues" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                />
                              </IconWrapper>
                            </Wrapper>

                            <Wrapper>
                              <FormItemStyled
                                label="Project"
                                {...restField}
                                name={[name, 'project']}
                              >
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
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <div style={{ textAlign: 'right' }}>
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
            <Divider />
            <>
              <h3>TODO</h3>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="todo" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                />
                              </IconWrapper>
                            </Wrapper>

                            <Wrapper>
                              <FormItemStyled
                                label="Project"
                                {...restField}
                                name={[name, 'project']}
                              >
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
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <div style={{ textAlign: 'right' }}>
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
            <Divider />
            <>
              <h3>OTHERS</h3>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="others" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                />
                              </IconWrapper>
                            </Wrapper>

                            <Wrapper>
                              <FormItemStyled
                                label="Project"
                                {...restField}
                                name={[name, 'project']}
                              >
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
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <div style={{ textAlign: 'right' }}>
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
          </WrapperReportItem>
          <WrapperReportItem>
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Timesheet</h3>
                <Button type="primary" style={{ marginBottom: 12 }}>
                  Sync
                </Button>
              </div>
              {employeeReports.results &&
                employeeReports.results.map(report => (
                  <Form.List name="timesheets" key={report.id}>
                    {(fields, { add, remove }) => (
                      <>
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
                                  placeholder="Task link..."
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
                                />
                              </IconWrapper>
                            </Wrapper>

                            <Wrapper>
                              <FormItemStyled
                                label="Project"
                                {...restField}
                                name={[name, 'project']}
                              >
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
                                    margin: 6,
                                  }}
                                />
                              </IconWrapper>
                            </Wrapper>
                            <Wrapper>
                              <FormItemStyled
                                label="Progress"
                                {...restField}
                                style={{ marginTop: 40 }}
                                name={[name, 'description']}
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
                                  max={100}
                                  min={0}
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
                                  defaultValue={
                                    !isCreate && report.type === '1'
                                      ? report.today_hour
                                      : ''
                                  }
                                />
                                h tomorrow
                              </FormItemStyled>
                            </Wrapper>
                            <div style={{ textAlign: 'right' }}>
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
                            </div>
                          </WrapperItem>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={() => add()}>
                            + Add
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                ))}
            </>
          </WrapperReportItem>
        </ModalContentWrapper>
      </Form>
    );
  },
);

const IconWrapper = styled.span`
  cursor: pointer;
`;

const FormItemStyled = styled(Form.Item)`
  width: 100%;
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
  /* border-radius: 10px; */
  padding: 16px;
`;

const StyledInputProgress = styled(Input)`
  width: 50px;
  margin: 0px 8px;
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
  padding: 12px;
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

export default Report;
