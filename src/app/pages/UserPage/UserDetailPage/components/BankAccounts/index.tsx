/**
 *
 * BankAccounts
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { UserDetailMessages } from '../../messages';

interface BankAccountsProps {
  isView?: boolean;
}

export const BankAccounts = (props: BankAccountsProps) => {
  const { isView } = props;
  const { t } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formBankAccountsTitle())}</b>
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
                      label={`${t(
                        UserDetailMessages.formBankAccountsTitle(),
                      )} ${name + 1}`}
                      name={[name, 'bank_name']}
                      fieldKey={[fieldKey, 'bank_name']}
                      rules={[
                        {
                          required: true,
                          message: t(UserDetailMessages.formEmptyBankName()),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={
                          isView
                            ? ''
                            : t(UserDetailMessages.formBankNamePlaceholder())
                        }
                      />
                    </FormItem>
                  </Col>
                  <Col md={11} xs={24}>
                    <FormItem
                      {...restField}
                      label={`${t(UserDetailMessages.formBankNumberLabel())} ${
                        name + 1
                      }`}
                      name={[name, 'number']}
                      fieldKey={[fieldKey, 'number']}
                      rules={[
                        {
                          required: true,
                          message: t(UserDetailMessages.formEmptyBankNumber()),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={t(
                          UserDetailMessages.formBankNumberPlaceholder(),
                        )}
                      />
                    </FormItem>
                  </Col>
                  <Col md={2} xs={24}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                  <Col md={24} xs={24}>
                    <FormItem
                      {...restField}
                      label={`${t(UserDetailMessages.formBankBranchLabel())} ${
                        name + 1
                      }`}
                      name={[name, 'branch']}
                      fieldKey={[fieldKey, 'branch']}
                      rules={[
                        {
                          required: true,
                          message: t(UserDetailMessages.formEmptyBankBranch()),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={t(
                          UserDetailMessages.formBankBranchPlaceholder(),
                        )}
                      />
                    </FormItem>
                  </Col>
                </Row>
              ))}
              {!isView && (
                <FormItem label="&nbsp;">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    size="large"
                    icon={<PlusOutlined />}
                  >
                    {t(UserDetailMessages.formBankAddButton())}
                  </Button>
                </FormItem>
              )}
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
