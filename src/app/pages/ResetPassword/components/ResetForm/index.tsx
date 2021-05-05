import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { RuleObject } from 'rc-field-form/lib/interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { ResetPageMessages } from '../../messages';
import { useSendReset } from '../../useSendReset';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

interface FormPayload {
  new_password1: string;
  new_password2: string;
  otp: string;
}

const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const ResetForm: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { send, loading } = useSendReset();

  const onFinish = async (values: FormPayload) => {
    console.log(values);
    await send(values);
  };

  const checkNewPassword = (
    rule: RuleObject,
    value: string,
    callback: (message?: string) => void,
  ) => {
    if (value) {
      if (!regex.test(value)) {
        callback(t(ResetPageMessages.invalidNewPassword()));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  const checkConfirmPassword = (
    rule: RuleObject,
    value: string,
    callback: (message?: string) => void,
  ) => {
    const password = form.getFieldValue('new_password1');
    if (value) {
      if (password) {
        if (!regex.test(value)) {
          callback(t(ResetPageMessages.invalidRetypePassword()));
        } else {
          if (value !== password) {
            callback(t(ResetPageMessages.notMatchRetypePassword()));
          } else {
            callback();
          }
        }
      } else if (password.length === 0 || password === undefined) {
        callback(t(ResetPageMessages.emptyPasswordRetypePassword()));
      }
    } else {
      callback();
    }
  };

  return (
    <Wrapper>
      <Form {...layout} onFinish={onFinish} form={form}>
        <FormItem
          name="new_password1"
          label={t(ResetPageMessages.newPassword())}
          rules={[
            {
              required: true,
              message: t(ResetPageMessages.emptyNewPassword()),
            },
            {
              validator: checkNewPassword,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t(ResetPageMessages.newPasswordPlaceholder())}
            size="large"
          />
        </FormItem>
        <FormItem
          name="new_password2"
          label={t(ResetPageMessages.retypePassword())}
          rules={[
            {
              required: true,
              message: t(ResetPageMessages.emptyRetypePassword()),
            },
            {
              validator: checkConfirmPassword,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t(ResetPageMessages.retypePasswordPlaceholder())}
            size="large"
          />
        </FormItem>
        <FormItem
          name="otp"
          label={t(ResetPageMessages.otpLabel())}
          rules={[
            {
              required: true,
              message: t(ResetPageMessages.otpEmpty()),
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t(ResetPageMessages.otpPlaceholder())}
            size="large"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            loading={loading}
            block
            size="large"
            htmlType="submit"
          >
            {t(ResetPageMessages.resetButton())}
          </Button>
        </FormItem>
      </Form>
    </Wrapper>
  );
};

const FormItem = styled(Form.Item)`
  label {
    font-weight: bold;
  }
`;

const Wrapper = styled.div`
  button {
    width: 100%;
    text-align: center;
    font-weight: 500 !important;
    font-size: 16px !important;
  }
`;
