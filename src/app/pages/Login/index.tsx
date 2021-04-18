import { Col, Row } from 'antd';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { LoginForm } from './components/LoginForm';

export const Login: React.FC = () => {
  return (
    <Wrapper>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginWrapper justify="center" align="middle">
        <Form xxl={6} xl={8} lg={10} xs={21}>
          <Title>
            <h1>Login</h1>
          </Title>
          <LoginForm />
        </Form>
      </LoginWrapper>
    </Wrapper>
  );
};

export default Login;

const Title = styled.div`
  text-align: center;
`;

const LoginWrapper = styled(Row)`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const Form = styled(Col)`
  background-color: #fff;
  padding: 2em;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgb(0 0 0 / 30%);
`;

const Wrapper = styled.div`
  background-color: #ececec;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
