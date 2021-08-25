/**
 *
 * BankAccounts
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, FormInstance, Input, Row, Select } from 'antd';
import { UserDetailMessages } from '../../messages';
import { TitlePath } from '../TitlePath';

const banks = [
  {
    id: 1,
    name: 'Vietcombank',
  },
  {
    id: 2,
    name: 'Sacombank',
  },
  {
    id: 3,
    name: 'Techcombank',
  },
  {
    id: 4,
    name: 'ACB',
  },
  {
    id: 5,
    name: 'TPBank',
  },
];

interface BankAccountsProps {
  isView?: boolean;
  isEdit?: boolean;
  form: FormInstance;
}

const { Option } = Select;

export const BankAccounts = (props: BankAccountsProps) => {
  const { isView, isEdit } = props;
  const { t } = useTranslation();

  return (
    <>
      <DividerWrapper isView={isView}>
        <Divider />
      </DividerWrapper>
      <TitlePath>
        <b>{t(UserDetailMessages.formBankAccountsTitle())}</b>
      </TitlePath>
      {isView || isEdit ? (
        <Form.List name="bank_accounts">
          {fields =>
            fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row gutter={[32, 0]} key={key}>
                <Col md={isView ? 24 : 8} xs={24}>
                  <Row gutter={[0, 12]} align="middle">
                    <Col md={isView ? 8 : 24} xs={24}>
                      {t(UserDetailMessages.formBankNameLabel())}
                    </Col>
                    <Col md={isView ? 16 : 24} xs={24}>
                      <FormItem
                        isView={isView}
                        {...restField}
                        name={[name, 'bank_name']}
                        fieldKey={[fieldKey, 'bank_name']}
                      >
                        {isView ? (
                          <Input
                            bordered={false}
                            readOnly={true}
                            size="large"
                          />
                        ) : (
                          <Select
                            size="large"
                            placeholder={t(
                              UserDetailMessages.formBankNamePlaceholder(),
                            )}
                          >
                            {banks.map(item => {
                              return (
                                <Option key={item.id} value={item.name}>
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
                <Col md={isView ? 24 : 8} xs={24}>
                  <Row gutter={[0, 12]} align="middle">
                    <Col md={isView ? 8 : 24} xs={24}>
                      {t(UserDetailMessages.formBankNumberLabel())}
                    </Col>
                    <Col md={isView ? 16 : 24} xs={24}>
                      <FormItem
                        isView={isView}
                        {...restField}
                        name={[name, 'number']}
                        fieldKey={[fieldKey, 'number']}
                      >
                        <Input
                          bordered={!isView}
                          readOnly={isView}
                          size="large"
                          placeholder={
                            isView
                              ? ''
                              : t(
                                  UserDetailMessages.formBankNumberPlaceholder(),
                                )
                          }
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col md={isView ? 24 : 8} xs={24}>
                  <Row gutter={[0, 12]} align="middle">
                    <Col md={isView ? 8 : 24} xs={24}>
                      {t(UserDetailMessages.formBankBranchLabel())}
                    </Col>
                    <Col md={isView ? 16 : 24} xs={24}>
                      <FormItem
                        isView={isView}
                        {...restField}
                        name={[name, 'branch']}
                        fieldKey={[fieldKey, 'branch']}
                      >
                        <Input
                          bordered={!isView}
                          readOnly={isView}
                          size="large"
                          placeholder={
                            isView
                              ? ''
                              : t(
                                  UserDetailMessages.formBankBranchPlaceholder(),
                                )
                          }
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))
          }
        </Form.List>
      ) : (
        <Row gutter={[32, 0]}>
          <Col md={8} xs={24}>
            <Row gutter={[0, 12]} align="middle">
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formBankNameLabel())}
              </Col>
              <Col md={24} xs={24}>
                <FormItem name="bank_name">
                  <Select
                    size="large"
                    placeholder={t(
                      UserDetailMessages.formBankNamePlaceholder(),
                    )}
                  >
                    {banks.map(item => {
                      return (
                        <Option key={item.id} value={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={8} xs={24}>
            <Row gutter={[0, 12]} align="middle">
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formBankNumberLabel())}
              </Col>
              <Col md={24} xs={24}>
                <FormItem name="number">
                  <Input
                    size="large"
                    placeholder={t(
                      UserDetailMessages.formBankNumberPlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={8} xs={24}>
            <Row gutter={[0, 12]} align="middle">
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formBankBranchLabel())}
              </Col>
              <Col md={isView ? 16 : 24} xs={24}>
                <FormItem name="branch">
                  <Input
                    size="large"
                    placeholder={t(
                      UserDetailMessages.formBankBranchPlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

interface FormItemProps {
  isView?: boolean;
}

const FormItem = styled(Form.Item)`
  align-items: center;
  margin-bottom: ${(props: FormItemProps) => (props.isView ? '0px' : '12px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;

const DividerWrapper = styled.div`
  margin: ${(props: FormItemProps) => (props.isView ? '35px 0 53px 0' : '0px')};
`;
