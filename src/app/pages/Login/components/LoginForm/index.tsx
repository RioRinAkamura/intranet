import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useAuthState } from 'app/components/Auth';
import { useAuthSlice } from 'app/components/Auth/slice';
import { selectAuth } from 'app/components/Auth/slice/selectors';
import { Login } from 'app/components/GoogleLoginButton';
import { Logout } from 'app/components/GoogleLogoutButton';
import config from 'config';
import React, { useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

const FormItem = Form.Item;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: {
    sm: { offset: 3, span: 21 },
    md: { offset: 6, span: 18 },
    lg: { offset: 3, span: 21 },
  },
};

export const LoginForm: React.FC = () => {
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const authState = useAuthState();
  const history = useHistory();

  const onFinish = values => {
    dispatch(actions.login({ ...values }));
  };

  // useEffect(() => {
  //   const { authenticated } = auth;
  //   if (authenticated) {
  //     authState.authenticated = true;
  //     history.push('/users');
  //   }
  // }, [auth]);

  return (
    <Form {...layout} onFinish={onFinish}>
      <FormItem
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Your email is invalid!' },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </FormItem>
      <FormItem {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </FormItem>
      <FormItem {...tailLayout}>
        <Row gutter={[8, 8]}>
          <Col>
            <Button type="primary" htmlType="submit" size="large">
              Login
            </Button>
          </Col>
          <Col>
            <Login />
          </Col>
          <Col>
            <Logout />
          </Col>
        </Row>
      </FormItem>
    </Form>
  );
};

export default LoginForm;
