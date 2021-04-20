/**
 *
 * ProfileInfo
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, DatePicker, Divider, Form, Input, Radio, Row } from 'antd';
import { UserDetailMessages } from '../../messages';

interface Props {}

export const ProfileInfo = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Row gutter={[16, 16]}>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formProfileTitle())}</b>
      </Divider>
      <Col md={6} xs={24}>
        <FormItem
          label={t(UserDetailMessages.formFirstNameLabel())}
          name="first_name"
          rules={[
            {
              required: true,
              message: t(UserDetailMessages.formEmptyFirstName()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UserDetailMessages.formFirstNamePlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          label={t(UserDetailMessages.formLastNameLabel())}
          name="last_name"
          rules={[
            {
              required: true,
              message: t(UserDetailMessages.formEmptyLastName()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UserDetailMessages.formLastNamePlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="dob" label={t(UserDetailMessages.formDOBLabel())}>
          <DatePicker
            size="large"
            placeholder={t(UserDetailMessages.formDOBPlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem name="gender" label={t(UserDetailMessages.formGenderLabel())}>
          <Radio.Group>
            <Radio value="Male">
              {t(UserDetailMessages.formGenderMaleLabel())}
            </Radio>
            <Radio value="Female">
              {t(UserDetailMessages.formGenderFemaleLabel())}
            </Radio>
          </Radio.Group>
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          label={t(UserDetailMessages.formPhoneNumberLabel())}
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: t(UserDetailMessages.formEmptyPhoneNumber()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UserDetailMessages.formPhoneNumberPlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={12} xs={24}>
        <FormItem
          label={t(UserDetailMessages.formEmailLabel())}
          name="email"
          rules={[
            {
              required: true,
              message: t(UserDetailMessages.formEmptyEmail()),
            },
            {
              type: 'email',
              message: t(UserDetailMessages.formInvalidEmail()),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t(UserDetailMessages.formEmailPlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem label={t(UserDetailMessages.formStatusLabel())} name="status">
          <Radio.Group defaultValue="Single">
            <Radio value="Single">
              {t(UserDetailMessages.formStatusSingleLabel())}
            </Radio>
            <Radio value="Married">
              {t(UserDetailMessages.formStatusMarriedLabel())}
            </Radio>
          </Radio.Group>
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          name="id_number"
          label={t(UserDetailMessages.formIdNumberLabel())}
        >
          <Input
            size="large"
            placeholder={t(UserDetailMessages.formIdNumberPlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          name="issued_date"
          label={t(UserDetailMessages.formIssuedDateLabel())}
        >
          <DatePicker
            size="large"
            placeholder={t(UserDetailMessages.formIssuedDatePlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          name="issued_place"
          label={t(UserDetailMessages.formIssuedPlaceLabel())}
        >
          <Input
            size="large"
            placeholder={t(UserDetailMessages.formIssuedPlacePlaceholder())}
          />
        </FormItem>
      </Col>
      <Col md={6} xs={24}>
        <FormItem
          name="social_insurance_no"
          label={t(UserDetailMessages.formSocialInsuranceNoLabel())}
        >
          <Input
            size="large"
            placeholder={t(
              UserDetailMessages.formSocialInsuranceNoPlaceholder(),
            )}
          />
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
