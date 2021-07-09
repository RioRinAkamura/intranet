import React from 'react';
import styled from 'styled-components/macro';
import { Button as ButtonAntd } from 'antd';

const ButtonStyled = styled(ButtonAntd)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = styled(ButtonAntd)`
  margin: 5px;
  span {
    position: absolute !important;
    width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
`;

const Button = props => {
  const { children, shape, size } = props;
  return (
    <ButtonStyled shape={shape || 'round'} size={size || 'large'} {...props}>
      {children}
    </ButtonStyled>
  );
};

export default Button;
