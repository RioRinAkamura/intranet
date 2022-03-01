/**
 *
 * SearchUsers
 *
 */
import { SearchOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { MessageTranslate } from 'utils/types';
import queryString from 'query-string';

const { Option } = Select;
interface Props {
  onSearch: (checked: boolean) => void;
  onReset: () => void;
  searchDeleted?: boolean;
  searchNextMonitoring?: boolean;
  searchNextMonitoringAt?: (value) => void;
  searchEmployeeProjects?: string | string[];
  searchEmployeeProjectList?: (value) => void;
  messageTrans?: MessageTranslate;
  form: FormInstance;
  value?: string | number;
  loading: boolean;
}
interface LocationState {
  is_deteted: boolean;
}

export const TotalSearchForm = memo((props: Props) => {
  const {
    form,
    onSearch,
    onReset,
    messageTrans,
    searchNextMonitoringAt,
    searchDeleted,
    searchNextMonitoring,
    searchEmployeeProjects,
    searchEmployeeProjectList,
  } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const location = useLocation<LocationState>();
  const [inputSearch, setInputSearch] = useState<any>(
    queryString.parse(location.search).search,
  );

  useEffect(() => {
    if (location.search) {
      setInputSearch(queryString.parse(location.search).search);
    }
  }, [location.search]);

  const handlNextMornitoringChange = value => {
    if (searchNextMonitoringAt) {
      searchNextMonitoringAt(value);
    }
  };

  const handleSearchEmployeeProjectList = value => {
    if (searchEmployeeProjectList) {
      searchEmployeeProjectList(value);
    }
  };

  useEffect(() => {
    const paramsDeleted = new URLSearchParams(location.search);
    const checkDeleted = paramsDeleted.get('is_deleted');
    if (checkDeleted) {
      if (!checked) {
        setChecked(true);
      }
    } else {
      setChecked(false);
    }
  }, [location, checked]);

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
                checked={checked}
              >
                Deleted
              </Checkbox>
            </FormItem>
          </Col>
        )}
        {Boolean(searchNextMonitoring) && (
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
        {searchEmployeeProjects && (
          <Col xl={6} lg={12} md={12} sm={12} xs={12}>
            <FormItem name="same_projects">
              <SelectProjectList
                size="large"
                defaultValue={searchEmployeeProjects}
                value={searchEmployeeProjects}
                onChange={value => handleSearchEmployeeProjectList(value)}
              >
                <Option value="all">All Projects</Option>
                <Option value="active_projects">My Active Projects</Option>
                <Option value="achieved_projects">My All Projects</Option>
              </SelectProjectList>
            </FormItem>
          </Col>
        )}

        <Col xl={14} lg={24} md={24} sm={24} xs={24}>
          <FormItem name="search" initialValue={inputSearch}>
            <Input
              placeholder={t(messageTrans?.searchPlaceholder())}
              allowClear
              size="large"
              autoFocus
              value={inputSearch}
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
const SelectProjectList = styled(Select)`
  width: 100%;
`;
