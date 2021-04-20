import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import img from './assets/logo@3x.png';
// const img = require('./assets/logo@3x.png');
export function Logo() {
  return (
    <Wrapper>
      <Link to="/">
        <img src={img} alt="" width="100%" />
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 29px;
  margin: 16px;
`;
