import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { ForgotPageMessages } from '../../messages';
import { useSendMailForgot } from '../../useSendMailForgot';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

interface FormPayload {
  email: string;
}

export const ForgotForm: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { send, loading } = useSendMailForgot();

  const onFinish = async (values: FormPayload) => {
    await send(values);
  };

  return (
    <Wrapper>
      <Form {...layout} onFinish={onFinish} form={form}>
        <FormItem
          name="email"
          label={t(ForgotPageMessages.emailLabel())}
          rules={[
            {
              required: true,
              message: t(ForgotPageMessages.emptyEmail()),
            },
            {
              type: 'email',
              message: t(ForgotPageMessages.invalidEmail()),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            size="large"
            placeholder={t(ForgotPageMessages.emailPlaceholder())}
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            block
            loading={loading}
          >
            {t(ForgotPageMessages.forgotButton())}
          </Button>
        </FormItem>
        <LoginPath>
          Did you remember your password?{' '}
          <a href="/login">{t(ForgotPageMessages.backtButton())}</a>
        </LoginPath>
      </Form>
    </Wrapper>
  );
};

const FormItem = styled(Form.Item)`
  label {
    font-weight: bold;
  }
  div {
    text-align: center;
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

const LoginPath = styled.p`
  color: gray;
  text-align: center;
  width: 90%;
  margin: 0 auto;
`;
