/**
 *
 * SearchUsers
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, FormInstance, Input, Row } from 'antd';
import { UsersMessages } from '../../messages';
interface Props {
  onSearch: () => void;
  onReset: () => void;
  form: FormInstance;
  value?: string;
  loading: boolean;
}

export const SearchUsers = memo((props: Props) => {
  const { form, onSearch, onReset, loading, value } = props;
  const { t } = useTranslation();

  return (
    <Form form={form} onFinish={onSearch}>
      <Row gutter={[8, 8]} align="middle" justify="end">
        <Col xl={18} lg={24} md={24} sm={24} xs={24}>
          <FormItem name="search" initialValue={value}>
            <Input.Search
              placeholder={t(UsersMessages.searchPlaceholder())}
              allowClear
              size="large"
              onChange={e => e.type === 'click' && onReset()}
              enterButton
              loading={loading}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
});

const FormItem = styled(Form.Item)`
  padding: 0;
  margin: 0;
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;
