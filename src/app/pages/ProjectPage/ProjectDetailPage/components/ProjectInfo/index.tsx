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
import config from 'config';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { datePickerViewProps, inputViewProps } from 'utils/types';
import { ProjectDetailMessages } from '../../messages';

interface Props {
  isView?: boolean;
  form: FormInstance;
  data?: any;
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
  const { isView, form, data } = props;
  const { t } = useTranslation();
  const [overview, setOverview] = useState('');

  const priority = [
    {
      name: t(ProjectDetailMessages.formProjectPriorityLow()),
      value: 1,
    },
    {
      name: t(ProjectDetailMessages.formProjectPriorityMedium()),
      value: 2,
    },
    {
      name: t(ProjectDetailMessages.formProjectPriorityHigh()),
      value: 3,
    },
  ];

  const status = [
    {
      name: t(ProjectDetailMessages.formProjectStatusPreparing()),
      value: 1,
    },
    {
      name: t(ProjectDetailMessages.formProjectStatusGoing()),
      value: 2,
    },
    {
      name: t(ProjectDetailMessages.formProjectStatusReleased()),
      value: 3,
    },
    {
      name: t(ProjectDetailMessages.formProjectStatusArchived()),
      value: 4,
    },
  ];

  useEffect(() => {
    if (data) {
      setOverview(data.overview);
    }
  }, [data]);

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
        <StyledData>{data?.priority || 'N/A'}</StyledData>
      </StyledWrapperDiv>

      <StyledWrapperDiv>
        <StyledTitle>
          {t(ProjectDetailMessages.formProjectStatusLabel())}
        </StyledTitle>
        <StyledData>{data?.status || 'N/A'}</StyledData>
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
        <Col md={14} xs={24}>
          <Row gutter={[14, isView ? 32 : 12]} align="middle">
            <Col md={isView ? 4 : 24} xs={24}>
              {t(ProjectDetailMessages.formProjectNameLabel())}
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <FormItem
                isView={isView}
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
            <Col md={isView ? 12 : 8} xs={24}>
              <Row gutter={isView ? [0, 24] : [0, 12]} align="middle">
                <Col md={isView ? 10 : 24} xs={24}>
                  {t(ProjectDetailMessages.formProjectStartedLabel())}
                </Col>
                <Col md={isView ? 14 : 24} xs={24}>
                  <FormItem isView={isView} name="started">
                    <DatePicker
                      {...(isView ? datePickerViewProps : {})}
                      format={DATE_FORMAT}
                      style={{ width: '100%' }}
                      size="large"
                      placeholder={
                        isView
                          ? ''
                          : t(
                              ProjectDetailMessages.formProjectStartedPlaceholder(),
                            )
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col md={isView ? 12 : 8} xs={24}>
              <Row gutter={isView ? [0, 24] : [0, 12]} align="middle">
                <Col md={isView ? 10 : 24} xs={24}>
                  {t(ProjectDetailMessages.formProjectPriorityLabel())}
                </Col>
                <Col md={isView ? 14 : 24} xs={24}>
                  <FormItem isView={isView} name="priority">
                    <Select
                      {...(isView && selectProps)}
                      size="large"
                      placeholder={t(
                        ProjectDetailMessages.formProjectPriorityPlaceholder(),
                      )}
                    >
                      {priority &&
                        priority.map((item, index: number) => {
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
            <Col md={isView ? 12 : 8} xs={24}>
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 10 : 24} xs={24}>
                  {t(ProjectDetailMessages.formProjectStatusLabel())}
                </Col>
                <Col md={isView ? 14 : 24} xs={24}>
                  <FormItem isView={isView} name="status">
                    <Select
                      {...(isView && selectProps)}
                      size="large"
                      placeholder={t(
                        ProjectDetailMessages.formProjectStatusPlaceholder(),
                      )}
                    >
                      {status &&
                        status.map((item, index: number) => {
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
          </Row>
          <Row gutter={[32, 12]}></Row>
        </Col>
        <Col md={10} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={24} xs={24}>
              {t(ProjectDetailMessages.formProjectOverviewLabel())}
            </Col>
            <Col md={24} xs={24}>
              <FormItem isView={isView} name="overview">
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
                        : t(
                            ProjectDetailMessages.formProjectOverviewPlaceholder(),
                          )
                    }
                    callback={e => {
                      form.setFieldsValue({ overview: e });
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
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
  align-items: center;
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0px' : '12px')};

  input {
    font-weight: ${(props: ScreenProps) => props.isView && 500};
  }
`;

const StyledWrapperDiv = styled.div`
  display: flex;
`;

const StyledDiv = styled.div`
  box-shadow: rgba(27, 31, 35, 0.1) 0px 1px 0px,
    rgba(255, 255, 255, 0.25) 0px 1px 0px inset;
  padding: 10px;
  margin-bottom: 20px;
`;

const StyledTitle = styled(StyledDiv)`
  width: 180px;
`;
const StyledData = styled(StyledDiv)`
  width: 400px;
  font-weight: 500;
  font-size: 16px;
`;
