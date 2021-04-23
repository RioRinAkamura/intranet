import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { RuleObject } from 'rc-field-form/lib/interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { ResetPageMessages } from '../../messages';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

interface FormPayload {
  newPassword: string;
  retypePassword: string;
}

export const ResetForm: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: FormPayload) => {};

  const checkNewPassword = (
    rule: RuleObject,
    value: string,
    callback: (message?: string) => void,
  ) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (value) {
      if (!regex.test(value)) {
        callback(t(ResetPageMessages.invalidNewPassword()));
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
    const password = form.getFieldValue('newPassword');
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (value) {
      if (password) {
        if (!regex.test(value)) {
          callback(t(ResetPageMessages.invalidRetypePassword()));
        } else {
          if (value !== password) {
            callback(t(ResetPageMessages.notMatchRetypePassword()));
          }
        }
      } else {
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
          name="newPassword"
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
          name="retypePassword"
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
        <FormItem>
          <Button type="primary" block size="large" htmlType="submit">
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
