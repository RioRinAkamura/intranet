/**
 *
 * JobInfo
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Input, Row, Select } from 'antd';
import { UsersMessages } from 'app/pages/UsersPage/messages';

interface Props {}

export const JobInfo = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UsersMessages.modalFormJobLabel())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col md={12} xs={24}>
          <FormItem
            label={t(UsersMessages.modalFormJobTitleLabel())}
            name="job_title"
          >
            <Input
              size="large"
              placeholder={t(UsersMessages.modalFormJobTitlePlaceholder())}
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem label={t(UsersMessages.modalFormTypeLabel())} name="type">
            <Select defaultValue="Full-time" size="large">
              <Select.Option value="Full-time">
                {t(UsersMessages.modalFormTypeFullTimeLabel())}
              </Select.Option>
              <Select.Option value="Part-time">
                {t(UsersMessages.modalFormTypePartTimeLabel())}
              </Select.Option>
              <Select.Option value="Probation">
                {t(UsersMessages.modalFormTypeProbationLabel())}
              </Select.Option>
              <Select.Option value="Etc">
                {t(UsersMessages.modalFormTypeEtcLabel())}
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
