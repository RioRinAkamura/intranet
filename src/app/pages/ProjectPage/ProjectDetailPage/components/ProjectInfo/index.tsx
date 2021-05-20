import { Col, DatePicker, Form, FormInstance, Input, Row, Select } from 'antd';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import config from 'config';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { datePickerViewProps, inputViewProps } from 'utils/types';
import { ProjectDetailMessages } from '../../messages';

interface Props {
  isView?: boolean;
  form: FormInstance;
  data?: any;
}

const DATE_FORMAT = config.DATE_FORMAT;
const { Option } = Select;

export const ProjectInfo = (props: Props) => {
  const { isView, form, data } = props;
  const { t } = useTranslation();

  const priority = [
    {
      name: t(ProjectDetailMessages.formProjectPriorityLow()),
      value: 'Low',
    },
    {
      name: t(ProjectDetailMessages.formProjectPriorityMedium()),
      value: 'Medium',
    },
    {
      name: t(ProjectDetailMessages.formProjectPriorityHigh()),
      value: 'High',
    },
  ];

  const status = [
    {
      name: t(ProjectDetailMessages.formProjectStatusPreparing()),
      value: 'Preparing',
    },
    {
      name: t(ProjectDetailMessages.formProjectStatusGoing()),
      value: 'Going',
    },
    {
      name: t(ProjectDetailMessages.formProjectStatusReleased()),
      value: 'Released',
    },
    {
      name: t(ProjectDetailMessages.formProjectStatusArchived()),
      value: 'Archived',
    },
  ];

  return (
    <Wrapper isView={isView}>
      <Row gutter={[32, 32]}>
        <Col md={14} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <h3>{t(ProjectDetailMessages.formProjectNameLabel())}</h3>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
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
          </Row>
          <Row gutter={[32, 12]}>
            <Col md={8} xs={24}>
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 12 : 24} xs={24}>
                  <h3>{t(ProjectDetailMessages.formProjectStartedLabel())}</h3>
                </Col>
                <Col md={isView ? 12 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="started"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: t(
                                ProjectDetailMessages.formProjectStartedEmpty(),
                              ),
                            },
                          ]
                    }
                  >
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
            <Col md={8} xs={24}>
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 8 : 24} xs={24}>
                  <h3>{t(ProjectDetailMessages.formProjectPriorityLabel())}</h3>
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="priority"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: t(
                                ProjectDetailMessages.formProjectPriorityEmpty(),
                              ),
                            },
                          ]
                    }
                  >
                    {isView ? (
                      <Input {...inputViewProps} size="large" />
                    ) : (
                      <Select
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
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col md={8} xs={24}>
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 8 : 24} xs={24}>
                  <h3>{t(ProjectDetailMessages.formProjectStatusLabel())}</h3>
                </Col>
                <Col md={isView ? 16 : 24} xs={24}>
                  <FormItem
                    isView={isView}
                    name="status"
                    rules={
                      isView
                        ? []
                        : [
                            {
                              required: true,
                              message: t(
                                ProjectDetailMessages.formProjectStatusEmpty(),
                              ),
                            },
                          ]
                    }
                  >
                    {isView ? (
                      <Input {...inputViewProps} size="large" />
                    ) : (
                      <Select
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
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={10} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={24} xs={24}>
              <h3>{t(ProjectDetailMessages.formProjectOverviewLabel())}</h3>
            </Col>
            <Col md={24} xs={24}>
              <FormItem
                isView={isView}
                name="overview"
                rules={
                  isView
                    ? []
                    : [
                        {
                          required: true,
                          message: t(
                            ProjectDetailMessages.formProjectOverviewEmpty(),
                          ),
                        },
                      ]
                }
              >
                <RichEditor
                  width="100%"
                  isView={isView}
                  data={data?.overview}
                  placeholder={t(
                    ProjectDetailMessages.formProjectOverviewPlaceholder(),
                  )}
                  callback={e => {
                    form.setFieldsValue({ overview: e });
                  }}
                />
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
`;

const FormItem = styled(Form.Item)`
  align-items: center;
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0px' : '12px')};

  label {
    font-weight: 500;
  }
  input {
    font-weight: ${(props: ScreenProps) => props.isView && 500};
  }
`;
