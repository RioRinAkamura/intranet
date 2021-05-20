/**
 *
 * SearchUsers
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, FormInstance, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MessageTranslate } from 'utils/types';
interface Props {
  onSearch: () => void;
  onReset: () => void;
  messageTrans: MessageTranslate;
  form: FormInstance;
  value?: string | number;
  loading: boolean;
}

export const TotalSearchForm = memo((props: Props) => {
  const { form, onSearch, onReset, value, messageTrans } = props;
  const { t } = useTranslation();

  return (
    <Form form={form}>
      <Row gutter={[8, 8]} align="middle" justify="end">
        <Col xl={18} lg={24} md={24} sm={24} xs={24}>
          <FormItem name="search" initialValue={value}>
            <Input
              placeholder={t(messageTrans.searchPlaceholder())}
              allowClear
              size="large"
              onChange={e => e.type === 'click' && onReset()}
              onPressEnter={onSearch}
              suffix={
                <SearchOutlined
                  style={{ color: '#1890ff', fontSize: 'x-large' }}
                  onClick={onSearch}
                />
              }
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
