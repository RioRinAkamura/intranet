/**
 *
 * ProfileInfo
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { UsersMessages } from 'app/pages/UsersPage/messages';
import { Col, DatePicker, Divider, Form, Input, Radio, Row } from 'antd';

interface Props {}

export const ProfileInfo = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <Row gutter={[16, 16]}>
      <Divider orientation="left">
        <b>{t(UsersMessages.modalInfomationTitle())}</b>
      </Divider>
      <Col md={6} xs={24}>
        <FormItem
          label={t(UsersMessages.modalFormFirstNameLabel())}
          name="first_name"
          rules={[
            {
              required: true,
              message: t(UsersMessages.modalFormEmptyFirstName()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UsersMessages.modalFormFirstNamePlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          label={t(UsersMessages.modalFormLastNameLabel())}
          name="last_name"
          rules={[
            {
              required: true,
              message: t(UsersMessages.modalFormEmptyLastName()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UsersMessages.modalFormLastNamePlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="dob" label={t(UsersMessages.modalFormDOBLabel())}>
          <DatePicker
            size="large"
            placeholder={t(UsersMessages.modalFormDOBPlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="gender" label={t(UsersMessages.modalFormGenderLabel())}>
          <Radio.Group>
            <Radio value="Male">
              {t(UsersMessages.modalFormGenderMaleLabel())}
            </Radio>
            <Radio value="Female">
              {t(UsersMessages.modalFormGenderFemaleLabel())}
            </Radio>
          </Radio.Group>
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          label={t(UsersMessages.modalFormPhoneNumberLabel())}
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: t(UsersMessages.modalFormEmptyPhoneNumber()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UsersMessages.modalFormPhoneNumberPlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={12} xs={24}>
        <FormItem
          label={t(UsersMessages.modalFormEmailLabel())}
          name="email"
          rules={[
            {
              required: true,
              message: t(UsersMessages.modalFormEmptyEmail()),
            },
            {
              type: 'email',
              message: t(UsersMessages.modalFormInvalidEmail()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UsersMessages.modalFormEmailPlaceholder())}
          />
          <Row gutter={[16, 16]}></Row>
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem label={t(UsersMessages.modalFormStatusLabel())} name="status">
          <Radio.Group defaultValue="Single">
            <Radio value="Single">
              {t(UsersMessages.modalFormStatusSingleLabel())}
            </Radio>
            <Radio value="Married">
              {t(UsersMessages.modalFormStatusMarriedLabel())}
            </Radio>
          </Radio.Group>
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="id_number" label="Id Number">
          <Input size="large" />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="issued_date" label="Issued Date">
          <DatePicker size="large" />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="issued_place" label="Issued Place">
          <Input size="large" />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="social_insurance_no" label="Social Insurance No">
          <Input size="large" />
        </FormItem>
      </Col>
    </Row>
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
