import React from 'react';
import styled from 'styled-components/macro';

export const Login: React.FC = () => {
  return (
    <Wrapper>
      <Title>Login page</Title>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  width: 960px;
  margin: 0 auto;
`;

const Title = styled.h1``;
