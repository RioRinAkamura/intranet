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
  SelectProps,
  Radio,
  Row,
  Select,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { SelectValue } from 'antd/lib/select';
import { TitlePath } from '../TitlePath';
import { RuleObject } from 'rc-field-form/lib/interface';
import moment from 'moment';
import config from 'config';

interface ProfileInfoProps {
  isView?: boolean;
  isEdit?: boolean;
  users?: any[];
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

const selectProps: SelectProps<SelectValue> = {
  autoClearSearchValue: false,
  bordered: false,
  dropdownStyle: { display: 'none' },
  removeIcon: null,
  showArrow: false,
  style: { pointerEvents: 'none' },
  placeholder: '',
};

const DATE_FORMAT = config.DATE_FORMAT;

const { Option } = Select;

export const ProfileInfo = (props: ProfileInfoProps) => {
  const { isView, isEdit, users } = props;
  const { t } = useTranslation();
  console.log(users, ' users');

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
    <>
      <TitlePath>
        <b>{t(UserDetailMessages.formProfileTitle())}</b>
      </TitlePath>
      <Row gutter={[128, 0]} align="middle">
        <Col md={12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formFirstNameLabel())}
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
              {t(UserDetailMessages.formDOBLabel())}
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
                  size="large"
                  placeholder={
                    isView ? '' : t(UserDetailMessages.formDOBPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formEmailLabel())}
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
                  size="large"
                  placeholder={
                    isView ? '' : t(UserDetailMessages.formEmailPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formStatusLabel())}
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem isView={isView} name="status" initialValue="Single">
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
          </Row>
        </Col>
        <Col
          md={12}
          xs={24}
          style={isView ? { borderLeft: '1px solid #c5c4c5' } : {}}
        >
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formLastNameLabel())}
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
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formLastNamePlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formGenderLabel())}
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
            <Col md={isView ? 8 : 24} xs={24}>
              User
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem isView={isView} name="user">
                <Select {...(isView ? selectProps : {})}>
                  {users?.map(user => {
                    return (
                      <Option
                        value={user.id}
                      >{`${user.first_name} ${user.last_name}`}</Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formPhoneNumberLabel())}
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
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formPhoneNumberPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {t(UserDetailMessages.formInsuranceNoLabel())}
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              {' '}
              <FormItem name="social_insurance_no" isView={isView}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
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
    </>
  );
};

interface ScreenProps {
  isView?: boolean;
}

const FormItem = styled(Form.Item)`
  align-items: center;
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0px' : '12px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
  input {
    font-weight: ${(props: ScreenProps) => props.isView && 500};
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
