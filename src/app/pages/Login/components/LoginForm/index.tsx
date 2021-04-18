import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { useLogin } from 'app/components/Auth/useLogin';
import { FacebookLoginButton } from 'app/components/FacebookLoginButton';
import { GoogleLoginButton } from 'app/components/GoogleLoginButton';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const LoginForm: React.FC = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const { login, loading } = useLogin();

  useEffect(() => {
    emailRef.current.focus();
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
        <FormItem
          name="email"
          label="Email address"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Your email is invalid!' },
          ]}
        >
          <Input prefix={<UserOutlined />} ref={emailRef} size="large" />
        </FormItem>
        <FormItem
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            ref={passwordRef}
            size="large"
          />
        </FormItem>
        <FormItem name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </FormItem>
        <FormItem>
          <Row gutter={[8, 8]} justify="space-between">
            <Col span={12}>
              <Button type="link" size="large">
                Forgot your password ?
              </Button>
            </Col>
            {/* <Col span={6}>
              <Button type="link" size="large">
                Sign Up
              </Button>
            </Col> */}
            <Col span={24}>
              <Button
                block
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                Login
              </Button>
            </Col>
          </Row>
        </FormItem>
        <Divider orientation="center">Or</Divider>
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
