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
  projectList: any[];
  form?: FormInstance;
  reportList?: Report[];
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const Going = ({
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
    today_hour: 0,
    tomorrow_hour: 0,
    today_progress: 0,
    tomorrow_progress: 0,
  };

  const { deleteEmployeeReport } = useHandleEmployeeTimesheets();

  const handleTaskClick = key => {
    const values = form?.getFieldValue('going');
    const link = values.map(value => value.reference);
    const win = window.open(`${link[key]}`, '_blank');
    if (win) {
      win.focus();
    }
  };
  const [goingReport, setGoingReport] = useState<Report[]>([]);

  const values = form?.getFieldValue('going');
  const projectName = values?.map(value => value?.project?.name);

  useEffect(() => {
    if (reportList) {
      const goingList = reportList.filter(report => report.type === '3');
      setGoingReport(goingList);
    }
  }, [reportList]);

  const onRemoveReport = async key => {
    if (goingReport[key]) {
      await deleteEmployeeReport(employeeId, goingReport[key].id);
    }
  };

  const handleProjectClick = key => {
    const values = form?.getFieldValue('going');
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
      <Form.List name="going">
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
                        placeholder="Enter task link"
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
                        />
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
                      label="Progress"
                      {...restField}
                      name={[name, 'today_progress']}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                      style={{
                        marginTop: isCreate || isEdit ? 40 : 0,
                        width: '40%',
                      }}
                    >
                      <StyledInputProgress
                        {...(isView ? inputProps : {})}
                        size="small"
                        type="number"
                        min={0}
                        max={100}
                      />
                    </FormItemStyled>
                    <span
                      style={{
                        marginTop: isCreate || isEdit ? 44 : 0,
                        width: '16%',
                      }}
                    >
                      % today
                    </span>

                    <FormItemStyled
                      {...restField}
                      name={[name, 'tomorrow_progress']}
                      rules={[
                        {
                          required: true,
                          message: '',
                        },
                      ]}
                      style={{
                        marginTop: isCreate || isEdit ? 40 : 0,
                        width: '16%',
                      }}
                    >
                      <StyledInputProgress
                        {...(isView ? inputProps : {})}
                        size="small"
                        type="number"
                        min={0}
                        max={100}
                      />
                    </FormItemStyled>
                    <span
                      style={{
                        marginTop: isCreate || isEdit ? 44 : 0,
                        width: '28%',
                      }}
                    >
                      % tomorrow
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

export default Going;
