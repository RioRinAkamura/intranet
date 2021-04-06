import { Col, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import LoginForm from './components/LoginForm';

export const Login: React.FC = () => {
  return (
    <Wrapper justify="center" align="middle">
      <Title span={24}>
        <h1>Login</h1>
      </Title>
      <Col xxl={6} xl={8} lg={10} xs={18}>
        <LoginForm />
      </Col>
    </Wrapper>
  );
};

export default Login;

const Title = styled(Col)`
  text-align: center;
`;

const Wrapper = styled(Row)`
  position: fixed;
  width: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;
