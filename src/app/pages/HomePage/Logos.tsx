import * as React from 'react';
import styled from 'styled-components/macro';

export function Logos() {
  return (
    <Wrapper>
      <img src="./assets/logo@3x.png" alt="" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 32px;
  margin: 16px;
  background: #7a7676;
`;
