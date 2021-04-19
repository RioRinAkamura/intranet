/**
 *
 * BankAccounts
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {}

export const BankAccounts = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>Bank Accounts</b>
      </Divider>
      <WrapperBank>
        <Form.List name="bank_accounts">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row
                  gutter={[16, 16]}
                  key={key}
                  justify="center"
                  align="middle"
                >
                  <Col md={11} xs={24}>
                    <FormItem
                      {...restField}
                      label={`Bank name ${name + 1}`}
                      name={[name, 'bank_name']}
                      fieldKey={[fieldKey, 'bank_name']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing bank name',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Input user's bank name"
                      />
                    </FormItem>
                  </Col>
                  <Col md={11} xs={24}>
                    <FormItem
                      {...restField}
                      label={`Bank number ${name + 1}`}
                      name={[name, 'number']}
                      fieldKey={[fieldKey, 'number']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing number',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Input user's bank number"
                      />
                    </FormItem>
                  </Col>
                  <Col md={2} xs={24}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                  <Col md={24} xs={24}>
                    <FormItem
                      {...restField}
                      label={`Branch ${name + 1}`}
                      name={[name, 'branch']}
                      fieldKey={[fieldKey, 'branch']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing branch',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Input user's bank branch"
                      />
                    </FormItem>
                  </Col>
                </Row>
              ))}
              <FormItem>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
              </FormItem>
            </>
          )}
        </Form.List>
      </WrapperBank>
    </>
  );
};

const FormItem = styled(Form.Item)`
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;


const WrapperBank = styled.div`
  height: 35vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
    margin-left: 5px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ececec;
    margin-left: 5px;
  }
`;
