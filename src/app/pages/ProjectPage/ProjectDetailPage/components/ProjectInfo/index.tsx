import { Col, DatePicker, Form, FormInstance, Input, Row, Select } from 'antd';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import config from 'config';
import React from 'react';
import styled from 'styled-components/macro';
import { datePickerViewProps, inputViewProps } from 'utils/types';

interface Props {
  isView?: boolean;
  form: FormInstance;
  data?: any;
}

const DATE_FORMAT = config.DATE_FORMAT;
const { Option } = Select;

export const ProjectInfo = (props: Props) => {
  const { isView, form, data } = props;

  const priority = [
    {
      name: 'Low',
      value: 'Low',
    },
    {
      name: 'Medium',
      value: 'Medium',
    },
    {
      name: 'High',
      value: 'High',
    },
  ];

  const status = [
    {
      name: 'Preparing',
      value: 'Preparing',
    },
    {
      name: 'Going',
      value: 'Going',
    },
    {
      name: 'Released',
      value: 'Released',
    },
    {
      name: 'Archived',
      value: 'Archived',
    },
  ];

  return (
    <Wrapper isView={isView}>
      <Row gutter={[32, 32]}>
        <Col md={14} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <h3>Project Name</h3>
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
                          message: "Please input project's name",
                        },
                      ]
                }
              >
                <Input
                  {...(isView ? inputViewProps : {})}
                  size="large"
                  placeholder={isView ? '' : "Project's Name"}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={[32, 12]}>
            <Col md={8} xs={24}>
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 12 : 24} xs={24}>
                  <h3>Project Started</h3>
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
                              message: "Please select project's stared date",
                            },
                          ]
                    }
                  >
                    <DatePicker
                      {...(isView ? datePickerViewProps : {})}
                      format={DATE_FORMAT}
                      style={{ width: '100%' }}
                      size="large"
                      placeholder={isView ? '' : "Project's start date"}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col md={8} xs={24}>
              <Row gutter={[0, 12]} align="middle">
                <Col md={isView ? 8 : 24} xs={24}>
                  <h3>Priority</h3>
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
                              message: "Please select project's priority",
                            },
                          ]
                    }
                  >
                    {isView ? (
                      <Input {...inputViewProps} size="large" />
                    ) : (
                      <Select size="large" placeholder="Project's Priority">
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
                  <h3>Status</h3>
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
                              message: "Please input project's status",
                            },
                          ]
                    }
                  >
                    {isView ? (
                      <Input {...inputViewProps} size="large" />
                    ) : (
                      <Select size="large" placeholder="Project's Status">
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
              <h3>Project Overview</h3>
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
                          message: "Please input project's name",
                        },
                      ]
                }
              >
                <RichEditor
                  width="100%"
                  isView={isView}
                  data={data?.overview}
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
