/**
 *
 * SearchUsers
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, FormInstance, Input, Row } from 'antd';
import { UsersMessages } from '../../messages';

interface Props {
  onSearch: () => void;
  onReset: () => void;
  form: FormInstance;
}

export const SearchUsers = memo((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      labelCol={{ xxl: 6, xl: 8, lg: 6, md: 8, xs: 6 }}
      wrapperCol={{ xxl: 18, xl: 16, lg: 18, md: 16, xs: 18 }}
    >
      <Row gutter={[8, 8]}>
        <Col xl={6} lg={12} md={12} sm={24} xs={24}>
          <FormItem name="search" label={t(UsersMessages.searchLabel())}>
            <Input placeholder={t(UsersMessages.searchPlaceholder())} />
          </FormItem>
        </Col>
        <Col>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button type="primary" onClick={onSearch}>
                {t(UsersMessages.searchSearchButton())}
              </Button>
            </Col>
            <Col>
              <Button onClick={onReset}>
                {t(UsersMessages.searchResetButton())}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
});

const FormItem = styled(Form.Item)`
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;
