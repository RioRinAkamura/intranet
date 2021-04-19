/**
 *
 * JobInfo
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Input, Row, Select } from 'antd';
import { UserDetailMessages } from '../../messages';

interface Props {}

export const JobInfo = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formJobTitle())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col md={12} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formJobTitleLabel())}
            name="job_title"
          >
            <Input
              size="large"
              placeholder={t(UserDetailMessages.formJobTitlePlaceholder())}
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem label={t(UserDetailMessages.formTypeLabel())} name="type">
            <Select defaultValue="Full-time" size="large">
              <Select.Option value="Full-time">
                {t(UserDetailMessages.formTypeFullTimeLabel())}
              </Select.Option>
              <Select.Option value="Part-time">
                {t(UserDetailMessages.formTypePartTimeLabel())}
              </Select.Option>
              <Select.Option value="Probation">
                {t(UserDetailMessages.formTypeProbationLabel())}
              </Select.Option>
              <Select.Option value="Etc">
                {t(UserDetailMessages.formTypeEtcLabel())}
              </Select.Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
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
