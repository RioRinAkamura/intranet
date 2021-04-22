/**
 *
 * ProfileInfo
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Form,
  Input,
  InputProps,
  Radio,
  Row,
} from 'antd';
import { UserDetailMessages } from '../../messages';

interface ProfileInfoProps {
  isView?: boolean;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const datePickerProps: DatePickerProps = {
  bordered: false,
  inputReadOnly: true,
  allowClear: false,
  popupStyle: { display: 'none' },
};

export const ProfileInfo = (props: ProfileInfoProps) => {
  const { isView } = props;
  const { t } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formProfileTitle())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col md={24} xs={24}>
          <FormItem
            name="code"
            label={t(UserDetailMessages.formCodeLabel())}
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: "Please input user's code",
                    },
                  ]
            }
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formCodePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formFirstNameLabel())}
            name="first_name"
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formEmptyFirstName()),
                    },
                  ]
            }
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formFirstNamePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formLastNameLabel())}
            name="last_name"
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formEmptyLastName()),
                    },
                  ]
            }
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formLastNamePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="dob"
            label={t(UserDetailMessages.formDOBLabel())}
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formEmptyDOB()),
                    },
                  ]
            }
          >
            <DatePicker
              {...(isView ? datePickerProps : {})}
              format="YYYY-MM-DD"
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formDOBPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="gender"
            label={t(UserDetailMessages.formGenderLabel())}
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formEmptyGender()),
                    },
                  ]
            }
            initialValue="Other"
          >
            {isView ? (
              <Input {...inputProps} size="large" />
            ) : (
              <Radio.Group defaultValue="Other">
                <Radio value="Male">
                  {t(UserDetailMessages.formGenderMaleLabel())}
                </Radio>
                <Radio value="Female">
                  {t(UserDetailMessages.formGenderFemaleLabel())}
                </Radio>
                <Radio value="Other">
                  {t(UserDetailMessages.formGenderOtherLabel())}
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Col>
        <Col md={24} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formEmailLabel())}
            name="email"
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formEmptyEmail()),
                    },
                    {
                      type: 'email',
                      message: t(UserDetailMessages.formInvalidEmail()),
                    },
                  ]
            }
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formEmailPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={24} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formPhoneNumberLabel())}
            name="phone"
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formEmptyPhoneNumber()),
                    },
                  ]
            }
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formPhoneNumberPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formStatusLabel())}
            name="status"
            initialValue="Single"
          >
            {isView ? (
              <Input {...inputProps} size="large" />
            ) : (
              <Radio.Group defaultValue="Single">
                <Radio value="Single">
                  {t(UserDetailMessages.formStatusSingleLabel())}
                </Radio>
                <Radio value="Married">
                  {t(UserDetailMessages.formStatusMarriedLabel())}
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="id_number"
            label={t(UserDetailMessages.formIdNumberLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formIdNumberPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="issued_date"
            label={t(UserDetailMessages.formIssuedDateLabel())}
          >
            <DatePicker
              {...(isView ? datePickerProps : {})}
              format="YYYY-MM-DD"
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formIssuedDatePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="issued_place"
            label={t(UserDetailMessages.formIssuedPlaceLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formIssuedPlacePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={24} xs={24}>
          <FormItem
            name="social_insurance_no"
            label={t(UserDetailMessages.formSocialInsuranceNoLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialInsuranceNoPlaceholder())
              }
            />
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
