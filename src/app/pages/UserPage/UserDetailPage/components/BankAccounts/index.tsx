/**
 *
 * BankAccounts
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, FormInstance, Input, Row } from 'antd';
import { UserDetailMessages } from '../../messages';
import { TitlePath } from '../TitlePath';

interface BankAccountsProps {
  isView?: boolean;
  isEdit?: boolean;
  form: FormInstance;
}

export const BankAccounts = (props: BankAccountsProps) => {
  const { isView } = props;
  const { t } = useTranslation();

  return (
    <>
      <Form.List name="bank_accounts">
        {(fields, { add, remove }) => (
          <>
            {fields.length > 0 && (
              <>
                <DividerWrapper isView={isView}>
                  <Divider />
                </DividerWrapper>
                <TitlePath>
                  <b>{t(UserDetailMessages.formBankAccountsTitle())}</b>
                </TitlePath>
              </>
            )}
            {fields.map(({ key, name, fieldKey, ...restField }) => (
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
                        <Input bordered={false} readOnly={true} size="large" />
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
                        <Input bordered={false} readOnly={true} size="large" />
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
                        <Input bordered={false} readOnly={true} size="large" />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </>
        )}
      </Form.List>
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
  input {
    padding: 0;
    font-weight: 500;
  }
`;

const DividerWrapper = styled.div`
  margin: ${(props: FormItemProps) => (props.isView ? '35px 0 53px 0' : '0px')};
`;
