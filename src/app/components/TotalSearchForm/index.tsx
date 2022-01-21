/**
 *
 * SearchUsers
 *
 */
import { SearchOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { MessageTranslate } from 'utils/types';

const { Option } = Select;
interface Props {
  onSearch: (checked: boolean) => void;
  onReset: () => void;
  searchDeleted?: boolean;
  searchNextMonitoring?: boolean;
  searchNextMonitoringAt?: (value) => void;
  messageTrans?: MessageTranslate;
  form: FormInstance;
  value?: string | number;
  loading: boolean;
}

export const TotalSearchForm = memo((props: Props) => {
  const {
    form,
    onSearch,
    onReset,
    value,
    messageTrans,
    searchNextMonitoringAt,
    searchDeleted,
    searchNextMonitoring,
  } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const handlNextMornitoringChange = value => {
    if (searchNextMonitoringAt) {
      searchNextMonitoringAt(value);
    }
  };

  return (
    <Form form={form}>
      <Row gutter={[8, 8]} align="middle" justify="end">
        {searchDeleted && (
          <Col
            xl={4}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            style={{ textAlign: 'right' }}
          >
            <FormItem name="deleted">
              <Checkbox
                onChange={() => {
                  onSearch(!checked);
                  setChecked(!checked);
                }}
              >
                Deleted
              </Checkbox>
            </FormItem>
          </Col>
        )}
        {searchNextMonitoring && (
          <Col xl={6} lg={12} md={12} sm={12} xs={12}>
            <FormItem name="next-monitoring-at">
              <SelectNextMonitoredAt
                size="large"
                defaultValue="all"
                onChange={value => handlNextMornitoringChange(value)}
              >
                <Option value="all">All</Option>
                <Option value="need-action">Need Actions</Option>
              </SelectNextMonitoredAt>
            </FormItem>
          </Col>
        )}
        <Col xl={14} lg={24} md={24} sm={24} xs={24}>
          <FormItem name="search" initialValue={value}>
            <Input
              placeholder={t(messageTrans?.searchPlaceholder())}
              allowClear
              size="large"
              onChange={e => e.type === 'click' && onReset()}
              onPressEnter={() => {
                onSearch(checked);
              }}
              suffix={
                <SearchOutlined
                  style={{ color: '#1890ff', fontSize: 'x-large' }}
                  onClick={() => onSearch(checked)}
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

const SelectNextMonitoredAt = styled(Select)`
  width: 100%;
`;
