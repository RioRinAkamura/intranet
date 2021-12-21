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
  Form,
  Input,
  InputProps,
  Radio,
  Row,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { TitlePath } from '../TitlePath';
import { RuleObject } from 'rc-field-form/lib/interface';
import moment from 'moment';
import config from 'config';

interface ProfileInfoProps {
  isView?: boolean;
  isEdit?: boolean;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const datePickerProps: DatePickerProps = {
  bordered: false,
  inputReadOnly: true,
  allowClear: false,
  suffixIcon: null,
  popupStyle: { display: 'none' },
};

const DATE_FORMAT = config.DATE_FORMAT;

export const ProfileInfo = (props: ProfileInfoProps) => {
  const { isView, isEdit } = props;
  const { t } = useTranslation();

  const validateDob = (
    rule: RuleObject,
    value: string,
    callback: (message?: string) => void,
  ) => {
    if (value) {
      if (moment().diff(value, 'year') < 16) {
        callback(t(UserDetailMessages.formInvalidDOB()));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  return (
    <ProfileInfoStyled>
      <TitlePath>
        <b>{t(UserDetailMessages.formProfileTitle())}</b>
      </TitlePath>
      <Row gutter={[128, 0]} align="middle">
        <Col md={12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formFirstNameLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem
                isView={isView}
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
                  tabIndex={1}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formFirstNamePlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formDOBLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem
                isView={isView}
                name="dob"
                rules={
                  isView
                    ? []
                    : [
                        {
                          required: true,
                          message: t(UserDetailMessages.formEmptyDOB()),
                        },
                        { validator: validateDob },
                      ]
                }
              >
                <DatePicker
                  {...(isView ? datePickerProps : {})}
                  format={DATE_FORMAT}
                  tabIndex={3}
                  size="large"
                  placeholder={
                    isView ? '' : t(UserDetailMessages.formDOBPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formEmailLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              {' '}
              <FormItem
                isView={isView}
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
                  disabled={isEdit}
                  tabIndex={7}
                  size="large"
                  placeholder={
                    isView ? '' : t(UserDetailMessages.formEmailPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formStatusLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem isView={isView} name="status" initialValue="Single">
                {isView ? (
                  <Input tabIndex={9} {...inputProps} size="large" />
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
          </Row>
        </Col>
        <Col
          md={12}
          xs={24}
          style={isView ? { borderLeft: '1px solid #c5c4c5' } : {}}
        >
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formLastNameLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem
                isView={isView}
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
                  tabIndex={2}
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formLastNamePlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formGenderLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem
                isView={isView}
                name="gender"
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
                  <Radio.Group size="large" defaultValue="Other">
                    <Radio tabIndex={4} value="Male">
                      {t(UserDetailMessages.formGenderMaleLabel())}
                    </Radio>
                    <Radio tabIndex={5} value="Female">
                      {t(UserDetailMessages.formGenderFemaleLabel())}
                    </Radio>
                    <Radio tabIndex={6} value="Other">
                      {t(UserDetailMessages.formGenderOtherLabel())}
                    </Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formPhoneNumberLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem
                isView={isView}
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
                  tabIndex={8}
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formPhoneNumberPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formInsuranceNoLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              {' '}
              <FormItem name="social_insurance_no" isView={isView}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  tabIndex={10}
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formInsuranceNoPlaceholder())
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>
    </ProfileInfoStyled>
  );
};

interface ScreenProps {
  isView?: boolean;
}

const ProfileInfoStyled = styled.div`
  .label {
    font-weight: 500;
  }
`;

const FormItem = styled(Form.Item)`
  align-items: center;
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0px' : '12px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
  #gender {
    label {
      margin-right: 5em;
    }
  }

  #status {
    label {
      margin-right: 10em;
    }
  }
`;
