import { MinusSquareFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Report } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Form, FormInstance, Input, InputProps, Select } from 'antd';
import Button from 'app/components/Button';
import { DialogModal } from 'app/components/DialogModal';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHandleEmployeeTimesheets } from '../../../useHandleEmployeeTimesheets';

const { Option } = Select;
const { TextArea } = Input;

interface ReportItemProps {
  isCreate?: boolean;
  isEdit?: boolean;
  isView?: boolean;
  employeeId: string;
  projectList?: any[];
  form?: FormInstance;
  reportList?: Report[];
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const Timesheets = ({
  isCreate,
  isView,
  isEdit,
  employeeId,
  projectList,
  form,
  reportList,
}: ReportItemProps) => {
  const defaultReportValue = {
    id: null,
    employee_id: employeeId,
    project_id: null,
    reference: null,
    date: null,
    type: null,
    description: null,
    today_hour: null,
    tomorrow_hour: null,
    today_progress: 0,
    tomorrow_progress: 0,
  };

  const { deleteEmployeeReport } = useHandleEmployeeTimesheets();

  const [timesheetReport, setTimesheetReport] = useState<Report[]>([]);

  const handleTaskClick = key => {
    const values = form?.getFieldValue('timesheets');
    const link = values.map(value => value.reference);
    const win = window.open(`${link[key]}`, '_blank');
    if (win) {
      win.focus();
    }
  };

  const values = form?.getFieldValue('timesheets');
  const projectName = values?.map(value => value?.project?.name);

  useEffect(() => {
    if (reportList) {
      const timesheetList = reportList.filter(report => report.type === '1');
      setTimesheetReport(timesheetList);
    }
  }, [reportList]);

  const onRemoveReport = async key => {
    if (timesheetReport[key]) {
      await deleteEmployeeReport(employeeId, timesheetReport[key].id);
    }
  };

  const handleProjectClick = key => {
    const values = form?.getFieldValue('timesheets');
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
      <Form.List name="timesheets">
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
                        size="small"
                        placeholder="Task link..."
                      />
                    </FormItemStyled>
                    <IconWrapper>
                      <QuestionCircleFilled
                        style={{
                          fontSize: 18,

                          margin: 6,
                        }}
                        onClick={() => handleTaskClick(key)}
                      />
                    </IconWrapper>
                  </Wrapper>

                  <Wrapper>
                    <FormItemStyled
                      label="Project"
                      {...restField}
                      name={[name, 'project_id']}
                      rules={
                        isCreate
                          ? [
                              {
                                required: true,
                                message: '',
                              },
                            ]
                          : undefined
                      }
                    >
                      {isView ? (
                        <Input
                          {...inputProps}
                          defaultValue={
                            projectName ? projectName[key] : undefined
                          }
                        />
                      ) : (
                        <StyledSelect
                          size="small"
                          placeholder="Select project"
                          defaultValue={
                            projectName ? projectName[key] : undefined
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
                          margin: 6,
                        }}
                        onClick={() => handleProjectClick(key)}
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
                        onClick={() => handleDescClick(key)}
                      />
                    </IconWrapper>
                  </Wrapper>
                  <Wrapper>
                    <FormItemStyled
                      label="Worklog"
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                      style={{
                        marginTop: isCreate || isEdit ? 36 : 0,
                      }}
                    >
                      <FormItemStyled style={{ height: '10px' }}>
                        <FormItemStyled
                          {...restField}
                          name={[name, 'today_hour']}
                          noStyle
                        >
                          <StyledInputProgress
                            {...(isView ? inputProps : {})}
                            size="small"
                            type="number"
                            min={1}
                            max={8}
                            style={{ marginLeft: 6 }}
                          />
                        </FormItemStyled>
                        <span>h today</span>
                        <FormItemStyled
                          {...restField}
                          name={[name, 'tomorrow_hour']}
                          rules={[
                            {
                              required: true,
                              message: '',
                            },
                          ]}
                          noStyle
                        >
                          <StyledInputProgress
                            {...(isView ? inputProps : {})}
                            size="small"
                            type="number"
                            min={0}
                            max={8}
                            style={{ marginLeft: 8 }}
                          />
                        </FormItemStyled>
                        <span>h tomorrow</span>
                      </FormItemStyled>
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
                          onClick={() => {
                            onRemoveReport(key);
                            remove(name);
                          }}
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
      <DialogModal
        isOpen={isDesc}
        cancelText={'Cancel'}
        handleCancel={handleCancelDesc}
        title="Description"
      >
        {desc ? desc : ''}
      </DialogModal>
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

const StyledSelect = styled(Select)`
  width: 100%;
`;

const StyledInputProgress = styled(Input)`
  width: 40px;
  text-align: center;
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
