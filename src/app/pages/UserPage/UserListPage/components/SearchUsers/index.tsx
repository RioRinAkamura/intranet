/**
 *
 * SearchUsers
 *
 */
import React, { memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, FormInstance, Input, Row } from 'antd';
import { UsersMessages } from '../../messages';
import { SearchOutlined } from '@ant-design/icons';

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
    <Form form={form}>
      <Row gutter={[8, 8]} align="middle">
        <Col xl={18} lg={12} md={12} sm={24} xs={24}>
          <FormItem name="search" initialValue={value}>
            <Input
              prefix={
                <SearchOutlined
                  style={{
                    fontSize: 'xx-large',
                    color: 'rgb(112 112 112)',
                  }}
                />
              }
              size="large"
              bordered={false}
              placeholder={t(UsersMessages.searchPlaceholder())}
              allowClear
              onChange={e => e.type === 'click' && onReset()}
            />
          </FormItem>
        </Col>
        <Col>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                onClick={onSearch}
              >
                {t(UsersMessages.searchSearchButton())}
              </Button>
            </Col>
          </Row>
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
