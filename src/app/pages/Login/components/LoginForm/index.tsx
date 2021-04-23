import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { useLogin } from 'app/components/Auth/useLogin';
import { FacebookLoginButton } from 'app/components/FacebookLoginButton';
import { GoogleLoginButton } from 'app/components/GoogleLoginButton';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { LoginMessages } from '../../messages';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const emailRef = useRef<Input>(null);
  const passwordRef = useRef<Input>(null);
  const { login, loading } = useLogin();

  useEffect(() => {
    emailRef.current?.focus();
    let emailClicked = true;
    let passwordClicked = false;
    function handleClickOutside(event) {
      if (event.target.id === 'email') {
        emailClicked = true;
      }
      if (event.target.id === 'password') {
        passwordClicked = true;
      }
      if (emailClicked && event.target.id !== 'email') {
        emailClicked = false;
        form.validateFields(['email']);
      }
      if (passwordClicked && event.target.id !== 'password') {
        passwordClicked = false;
        form.validateFields(['password']);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [form]);

  const onFinish = async (values: { email: string; password: string }) => {
    await login({ ...values });
    history.push('/employees');
  };

  return (
    <Wrapper>
      <Form {...layout} onFinish={onFinish} form={form}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <FormItem
              name="email"
              label={t(LoginMessages.email())}
              rules={[
                {
                  required: true,
                  message: t(LoginMessages.emptyEmail()),
                },
                {
                  type: 'email',
                  message: t(LoginMessages.invalidEmail()),
                },
              ]}
            >
              <Input prefix={<UserOutlined />} ref={emailRef} size="large" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              name="password"
              label={t(LoginMessages.password())}
              rules={[
                {
                  required: true,
                  message: t(LoginMessages.emptyPassword()),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                ref={passwordRef}
                size="large"
              />
            </FormItem>
          </Col>
          <Col md={12} xs={24}>
            <FormItem name="remember" valuePropName="checked">
              <Checkbox>{t(LoginMessages.rememberMe())}</Checkbox>
            </FormItem>
          </Col>
          <Col md={12} xs={24}>
            <FormItem>
              <Button type="link" href="/forgot-password" size="large">
                {t(LoginMessages.forgotPassword())}
              </Button>
            </FormItem>
          </Col>
          <Col span={24}>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              {t(LoginMessages.loginButton())}
            </Button>
            <p>
              {t(LoginMessages.dividerText())}
              <Button type="link">{t(LoginMessages.registerLinkText())}</Button>
            </p>
          </Col>
        </Row>
        <Divider orientation="center">{t(LoginMessages.dividerText())}</Divider>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <GoogleLoginButton />
          </Col>
          <Col span={24}>
            <FacebookLoginButton />
          </Col>
        </Row>
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
    font-weight: 500 !important;
    font-size: 16px !important;
  }
`;
