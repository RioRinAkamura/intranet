/**
 *
 * ProfileInfo
 *
 */
import { CopyOutlined } from '@ant-design/icons';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
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
import { IconButton } from 'app/components/Button';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import config from 'config';
import moment from 'moment';
import { RuleObject } from 'rc-field-form/lib/interface';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { UserDetailMessages } from '../../../messages';
import { useHandleEmployeeDetail } from '../../../useHandleEmployeeDetail';

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

export const ProfileInfoDetail = (props: ProfileInfoProps) => {
  const { isView } = props;
  const { t } = useTranslation();
  const { notify } = useNotify();
  const [form] = Form.useForm();
  const { user } = useHandleEmployeeDetail();

  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };

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

  const handleCopyEmployeeData = (fieldName: string) => {
    let data = form?.getFieldValue(fieldName);
    if (moment.isMoment(data)) {
      data = data.format(DATE_FORMAT);
    }

    navigator.clipboard.writeText(JSON.stringify(data, null, '\t'));
    notify({
      type: ToastMessageType.Info,
      message: 'Copied',
      duration: 2,
    });
  };

  const [data, setData] = React.useState<Employee>();
  React.useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);
  React.useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data.id,
        dob: data.dob && moment(data.dob, DATE_FORMAT),
        starting_date:
          data.starting_date && moment(data.starting_date, DATE_FORMAT),
      });
    }
  }, [data, form]);

  return (
    <ProfileInfoStyled>
      <Row gutter={[64, 0]} align="top">
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
            <Col md={isView ? 14 : 24} xs={24}>
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
            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('dob');
                  }}
                />
              </Col>
            )}

            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formEmailLabel())}
              </span>
            </Col>
            <Col md={isView ? 14 : 24} xs={24}>
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
                  disabled={!isView}
                  tabIndex={7}
                  size="large"
                  placeholder={
                    isView ? '' : t(UserDetailMessages.formEmailPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('email');
                  }}
                />
              </Col>
            )}

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
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formJoinedLabel())}
              </span>
            </Col>
            <Col md={isView ? 14 : 24} xs={24}>
              <FormItem isView={isView} name="starting_date">
                <DatePicker
                  {...(isView ? datePickerProps : {})}
                  disabledDate={disabledDate}
                  format={DATE_FORMAT}
                  tabIndex={3}
                  size="large"
                  placeholder={
                    isView ? '' : t(UserDetailMessages.formJoinedPlaceholder())
                  }
                />
              </FormItem>
            </Col>

            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('starting_date');
                  }}
                />
              </Col>
            )}
          </Row>
        </Col>
        <Col
          md={12}
          xs={24}
          style={isView ? { borderLeft: '1px solid #c5c4c5' } : {}}
        >
          <Row gutter={[0, 13]} align="middle">
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
            <Col md={isView ? 14 : 24} xs={24}>
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
            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('phone');
                  }}
                />
              </Col>
            )}

            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formInsuranceNoLabel())}
              </span>
            </Col>
            <Col md={isView ? 14 : 24} xs={24}>
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
            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('social_insurance_no');
                  }}
                />
              </Col>
            )}

            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formNicknameLabel())}
              </span>
            </Col>
            <Col md={isView ? 14 : 24} xs={24}>
              <FormItem name="nickname" isView={isView}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  tabIndex={10}
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formNicknamePlaceholder())
                  }
                />
              </FormItem>
            </Col>
            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('nickname');
                  }}
                />
              </Col>
            )}
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formPersionalEmailLabel())}
              </span>
            </Col>
            <Col md={isView ? 14 : 24} xs={24}>
              <FormItem
                name="personal_email"
                isView={isView}
                rules={
                  isView
                    ? []
                    : [
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
                  tabIndex={10}
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formPersionalEmailPlaceholder())
                  }
                />
              </FormItem>
            </Col>
            {isView && (
              <Col md={2}>
                <IconButton
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyEmployeeData('persional_email');
                  }}
                />
              </Col>
            )}
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
