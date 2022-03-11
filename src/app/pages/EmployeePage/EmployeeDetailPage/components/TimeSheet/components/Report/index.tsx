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
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { api } from 'utils/api';
import { datePickerViewProps } from 'utils/types';
import {
  CreateReportQueryParams,
  ReportQueryParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import { boolean } from 'yup';
import { useHandleEmployeeTimesheets } from '../../useHandleEmployeeTimesheets';
import { EmployeeTimesheet } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';

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
  isView?: boolean;
  form?: FormInstance;
  selectedTimesheet?: EmployeeTimesheet;
}

const Report = memo(
  ({
    employeeId,
    isCreate,
    isEdit,
    form,
    isView,
    selectedTimesheet,
  }: TimeSheetProps) => {
    const [projectList, setProjectList] = useState<any[]>([]);
    const [reportList, setReportList] = useState<any[]>([]);

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

    const handleToggle = () => {};

    const handleSyncClick = () => {
      console.log('sync');
    };

    const {
      employeeReports,
      fetchEmployeeReport,
      fetchEmployeeTimesheets,
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
      setReportList(employeeReports.results.map(report => report));
    }, [employeeReports]);

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

    // const [listDone, setListDone] = useState<any[]>(['']);
    // const [listGoing, setListGoing] = useState<any[]>(['']);
    // const [listBlocker, setListBlocker] = useState<any[]>(['']);
    // const [listIssue, setListIssue] = useState<any[]>(['']);
    // const [listTodo, setListTodo] = useState<any[]>(['']);
    // const [listOther, setListOther] = useState<any[]>(['']);
    // const [listTimesheet, setListTimesheet] = useState<any[]>(['']);

    // const onAddDoneClick = () => {
    //   let listDoneCopy = [...listDone];
    //   listDoneCopy.push(defaultReportValue);
    //   setListDone(listDoneCopy);
    //   console.log('listDone', listDone);
    // };

    // useEffect(() => {
    //   setListDone(
    //     employeeReports.results.filter(report => report.type === '2'),
    //   );
    //   setListGoing(
    //     employeeReports.results.filter(report => report.type === '3'),
    //   );
    //   setListBlocker(
    //     employeeReports.results.filter(report => report.type === '5'),
    //   );
    //   setListIssue(
    //     employeeReports.results.filter(report => report.type === '4'),
    //   );
    //   setListTodo(
    //     employeeReports.results.filter(report => report.type === '6'),
    //   );
    //   setListOther(
    //     employeeReports.results.filter(report => report.type === '7'),
    //   );
    //   setListTimesheet(
    //     employeeReports.results.filter(report => report.type === '1'),
    //   );
    // }, [employeeReports]);

    const handleTaskClick = taskLink => {
      const win = window.open(`${taskLink}`, '_blank');
      if (win) {
        win.focus();
      }
    };

    const [newDate, setNewDate] = useState<string>();

    const handleDateChange = date => {
      setNewDate(moment(date).format(DATE_FORMAT));
    };

    const [progressValue, setProgressValue] = useState<number>(0);
    const handleProgressChange = e => {
      setProgressValue(e.target.value);
    };

    const doneArr = reportList.filter(report => report.type === '2');
    const goingArr = reportList.filter(report => report.type === '3');
    const blockerArr = reportList.filter(report => report.type === '5');
    const issuesArr = reportList.filter(report => report.type === '4');
    const todoArr = reportList.filter(report => report.type === '6');
    const othersArr = reportList.filter(report => report.type === '7');
    const timesheetArr = reportList.filter(report => report.type === '1');

    const onFinish = values => {
      console.log('VALUES:', values);
      const doneList = values.done ? values.done : undefined;
      const goingList = values.going ? values.going : undefined;
      const blockerList = values.blockers ? values.blockers : undefined;
      const issueList = values.issues ? values.issues : undefined;
      const todoList = values.todo ? values.todo : undefined;
      const otherList = values.others ? values.others : undefined;
      const timesheetList = values.timesheets ? values.timesheets : undefined;

      let newDataArr: any[] = [];

      if (doneList) {
        const doneData = doneList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '2',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        newDataArr = [...newDataArr, doneData];
      }
      if (goingList) {
        const goingData = goingList.map(value => {
          return {
            id: value.id ? value.id : null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '3',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: value.today_progress,
            tomorrow_progress: value.tomorrow_progress,
          };
        });
        newDataArr = [...newDataArr, goingData];
      }
      if (blockerList) {
        const blockerData = blockerList.map(value => {
          return {
            id: null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '5',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        newDataArr = [...newDataArr, blockerData];
      }
      if (issueList) {
        const issueData = issueList.map(value => {
          return {
            id: null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '4',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        newDataArr = [...newDataArr, issueData];
      }
      if (todoList) {
        const todoData = todoList.map(value => {
          return {
            id: null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,

            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '6',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        newDataArr = [...newDataArr, todoData];
      }
      if (otherList) {
        const otherData = otherList.map(value => {
          return {
            id: null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,
            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '7',
            description: value.description,
            today_hour: 0,
            tomorrow_hour: 0,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        newDataArr = [...newDataArr, otherData];
      }
      if (timesheetList) {
        console.log('7');

        const timesheetData = timesheetList.map(value => {
          return {
            id: null,
            employee_id: employeeId,
            project_id: value.project_id ? value.project_id : null,

            reference: value.reference,
            date: newDate ? newDate : moment(values.date).format(DATE_FORMAT),
            type: '1',
            description: value.description,
            today_hour: value.today_hour,
            tomorrow_hour: value.tomorrow_hour,
            today_progress: 0,
            tomorrow_progress: 0,
          };
        });
        newDataArr = [...newDataArr, timesheetData];
      }

      let reportArr = Array.prototype.concat.apply([], newDataArr);
      console.log('reportArr', reportArr);

      // addEmployeeReport(employeeId, reportArr as ReportQueryParams);

      // for (let i = 0; i < reportArr.length; i++) {
      //   addEmployeeReport(employeeId, reportArr[i]);
      // }
      // addEmployeeReport(employeeId, reportArr[0]);

      // fetchEmployeeTimesheets(employeeId);
    };

    return (
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        // hideRequiredMark={true}
        initialValues={
          isCreate
            ? undefined
            : isView || isEdit
            ? {
                done: doneArr ? [''] : undefined,
                going: goingArr ? [''] : undefined,
                blockers: blockerArr ? [''] : undefined,
                issues: issuesArr ? [''] : undefined,
                todo: todoArr ? [''] : undefined,
                others: othersArr ? [''] : undefined,
                timesheets: timesheetArr ? [''] : undefined,
              }
            : undefined
        }
      >
        <Form.Item name="date">
          <ModalContentWrapper>
            <div>
              Date:
              <StyledDatePicker
                {...(isView ? datePickerViewProps : {})}
                format={DATE_FORMAT}
                disabledDate={disabledDate}
                defaultValue={
                  isCreate
                    ? moment(today, DATE_FORMAT)
                    : moment(selectedTimesheet?.date)
                }
                onChange={date => handleDateChange(date)}
                style={{ marginLeft: 12 }}
                allowClear={false}
              />
            </div>
            <div>
              {!isCreate && (
                <Button
                  type="default"
                  style={{ marginRight: '12px' }}
                  onClick={handleToggle}
                >
                  {isView ? 'Edit' : 'Preview'}
                </Button>
              )}
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
              <Form.List name="done">
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
                                    type="text"
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
                                  name={[name, 'project_id']}
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
                        <Button
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
            </>
            <Divider />
            <>
              <h3>GOING</h3>
              <Form.List name="going">
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
                                  name={[name, 'project_id']}
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
                                  {...restField}
                                  label="Progress"
                                  style={{
                                    marginTop: isCreate || isEdit ? 40 : 0,
                                    width: '55%',
                                  }}
                                  name={[name, 'today_progress']}
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
                                    min={0}
                                    max={100}
                                    defaultValue={
                                      !isCreate && report.type === '3'
                                        ? report.today_progress
                                        : ''
                                    }
                                    // value={progressValue}
                                    // onChange={e => handleProgressChange(e)}
                                  />
                                  % today
                                </FormItemStyled>

                                <FormItemStyled
                                  {...restField}
                                  style={{
                                    marginTop: isCreate || isEdit ? 40 : 0,
                                    width: '45%',
                                  }}
                                  name={[name, 'tomorrow_progress']}
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
                                    min={0}
                                    max={100}
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
                        <Button
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
            </>
            <Divider />
            <>
              <h3>BLOCKERS</h3>
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
                        <Button
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
            </>
            <Divider />
            <>
              <h3>ISSUES</h3>
              <Form.List name="issues">
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
                                  name={[name, 'project_id']}
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
                        <Button
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
            </>
            <Divider />
            <>
              <h3>TODO</h3>
              <Form.List name="todo">
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
                                  name={[name, 'project_id']}
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
                        <Button
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
            </>
            <Divider />
            <>
              <h3>OTHERS</h3>
              <Form.List name="others">
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
                                  name={[name, 'project_id']}
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
                        <Button
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
            </>
          </WrapperReportItem>
          <WrapperReportItem>
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Timesheet</h3>
                <Button
                  type="primary"
                  style={{ marginBottom: 12 }}
                  onClick={handleSyncClick}
                >
                  Sync
                </Button>
              </div>
              <Form.List name="timesheets">
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
                                  name={[name, 'project_id']}
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
                                  style={{
                                    marginTop: isCreate || isEdit ? 40 : 0,
                                  }}
                                  name={[name, 'today_hour']}
                                  // rules={[
                                  //   {
                                  //     required: true,
                                  //     message: '',
                                  //   },
                                  // ]}
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
                                        : 0
                                    }
                                  />
                                  h today
                                </FormItemStyled>

                                <FormItemStyled
                                  {...restField}
                                  style={{
                                    marginTop: isCreate || isEdit ? 40 : 0,
                                  }}
                                  name={[name, 'tomorrow_hour']}
                                  // rules={[
                                  //   {
                                  //     required: true,
                                  //     message: '',
                                  //   },
                                  // ]}
                                >
                                  <StyledInputProgress
                                    {...(isView ? inputProps : {})}
                                    size="small"
                                    type="number"
                                    max={100}
                                    min={0}
                                    defaultValue={
                                      !isCreate && report.type === '1'
                                        ? report.tomorrow_hour
                                        : 0
                                    }
                                  />
                                  h tomorrow
                                </FormItemStyled>
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
                        <Button
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
  background-color: #1c91ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  height: 72%;
  width: 80px;
  cursor: pointer;
  :hover {
    background-color: #188fffcc;
  }
`;

export default Report;
