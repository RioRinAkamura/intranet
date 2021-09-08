import {
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  SelectProps,
} from 'antd';
import { SelectValue } from 'antd/lib/select';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import { useProjectsSlice } from 'app/pages/ProjectPage/ProjectListPage/slice';
import { selectProjects } from 'app/pages/ProjectPage/ProjectListPage/slice/selectors';
import React, { useEffect, useState } from 'react';
import config from 'config';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { datePickerViewProps, inputViewProps } from 'utils/types';
import { ProjectDetailMessages } from '../../messages';
import { api } from 'utils/api';

interface Props {
  isView?: boolean;
  form: FormInstance;
  data?: any;
  isEdit?: boolean;
}

const selectProps: SelectProps<SelectValue> = {
  autoClearSearchValue: false,
  bordered: false,
  dropdownStyle: { display: 'none' },
  removeIcon: null,
  showArrow: false,
  style: { pointerEvents: 'none' },
};

const DATE_FORMAT = config.DATE_FORMAT;
const { Option } = Select;

export const ProjectInfo = (props: Props) => {
  const { isView, form, data, isEdit } = props;
  const { t } = useTranslation();
  const [overview, setOverview] = useState('');

  const dispatch = useDispatch();
  const { actions } = useProjectsSlice();
  const projectState = useSelector(selectProjects);

  const priorities = () => {
    return api.hr.project.getPriorities();
  };

  const statuses = () => {
    return api.hr.project.getStatuses();
  };

  const getPriorities = (value: string) => {
    return priorities().find(item => item.value === value);
  };

  const getStatuses = (value: string) => {
    return statuses().find(item => item.value === value);
  };

  useEffect(() => {
    if (data) {
      setOverview(data.overview);
    }
  }, [data]);

  useEffect(() => {
    if (!isEdit && !isView) {
      dispatch(actions.fetchIdentity());
    }
  }, [actions, dispatch, isEdit, isView]);

  useEffect(() => {
    if (projectState.identity && !isEdit) {
      form.setFieldsValue({ code: projectState.identity });
    }
  }, [projectState, form, isEdit]);

  return isView ? (
    <>
      <StyledWrapperDiv>
        <StyledTitle>
          {t(ProjectDetailMessages.formProjectNameLabel())}
        </StyledTitle>
        <StyledData>{data?.name || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>
          {t(ProjectDetailMessages.formProjectStartedLabel())}
        </StyledTitle>
        <StyledData>{data?.started || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>
          {t(ProjectDetailMessages.formProjectPriorityLabel())}
        </StyledTitle>
        <StyledData>
          {(data?.priority && getPriorities(data.priority)?.name) || 'N/A'}
        </StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>
          {t(ProjectDetailMessages.formProjectStatusLabel())}
        </StyledTitle>
        <StyledData>
          {(data?.status && getStatuses(data.status)?.name) || 'N/A'}
        </StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>
          {t(ProjectDetailMessages.formProjectOverviewLabel())}
        </StyledTitle>
        <StyledData>{data?.overview || 'N/A'}</StyledData>
      </StyledWrapperDiv>
    </>
  ) : (
    <Wrapper isView={isView}>
      <Row gutter={[32, 32]}>
        <Col span={12}>
          <Row gutter={[32, 32]}>
            <Col span={8}>
              <FormItem
                label={t(ProjectDetailMessages.formProjectCodeLabel())}
                name="code"
                rules={
                  isView
                    ? []
                    : [
                        {
                          required: true,
                          message: t(
                            ProjectDetailMessages.formProjectCodeEmpty(),
                          ),
                        },
                      ]
                }
              >
                <Input
                  {...(isView ? inputViewProps : {})}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(ProjectDetailMessages.formProjectCodePlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                label={t(ProjectDetailMessages.formProjectNameLabel())}
                name="name"
                rules={
                  isView
                    ? []
                    : [
                        {
                          required: true,
                          message: t(
                            ProjectDetailMessages.formProjectNameEmpty(),
                          ),
                        },
                      ]
                }
              >
                <Input
                  {...(isView ? inputViewProps : {})}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(ProjectDetailMessages.formProjectNamePlaceholder())
                  }
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={[32, 32]}>
            <Col span={8}>
              <FormItem
                label={t(ProjectDetailMessages.formProjectStartedLabel())}
                name="started"
              >
                <DatePicker
                  {...(isView ? datePickerViewProps : {})}
                  format={DATE_FORMAT}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(ProjectDetailMessages.formProjectStartedPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label={t(ProjectDetailMessages.formProjectPriorityLabel())}
                name="priority"
              >
                <Select
                  {...(isView && selectProps)}
                  size="large"
                  placeholder={t(
                    ProjectDetailMessages.formProjectPriorityPlaceholder(),
                  )}
                >
                  {priorities().map((item, index: number) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label={t(ProjectDetailMessages.formProjectStatusLabel())}
                name="status"
              >
                <Select
                  {...(isView && selectProps)}
                  size="large"
                  placeholder={t(
                    ProjectDetailMessages.formProjectStatusPlaceholder(),
                  )}
                >
                  {statuses().map((item, index: number) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <FormItem
            label={t(ProjectDetailMessages.formProjectOverviewLabel())}
            name="overview"
          >
            {isView ? (
              overview && (
                <RichEditor width="100%" data={overview} isView={isView} />
              )
            ) : (
              <RichEditor
                width="100%"
                data={overview}
                placeholder={
                  isView
                    ? ''
                    : t(ProjectDetailMessages.formProjectOverviewPlaceholder())
                }
                callback={e => {
                  form.setFieldsValue({ overview: e });
                }}
              />
            )}
          </FormItem>
        </Col>
      </Row>
    </Wrapper>
  );
};

interface ScreenProps {
  isView?: boolean;
}

const Wrapper = styled.div`
  h3 {
    margin: ${(props: ScreenProps) => props.isView && '0'};
  }
  margin-bottom: 1em;
`;

const FormItem = styled(Form.Item)`
  label {
    font-weight: 500;
  }
`;

const StyledWrapperDiv = styled.div`
  display: flex;
`;

const StyledDiv = styled.div`
  border: 1px solid lightgrey;
  padding: 10px;
  margin-bottom: -1px;
  margin-left: -1px;
`;

const StyledTitle = styled(StyledDiv)`
  width: 250px;
  background-color: #f2f2f2;
  opacity: 0.7;
`;
const StyledData = styled(StyledDiv)`
  width: 100%;
  font-weight: 500;
  padding-left: 20px;
  font-size: 16px;
`;
