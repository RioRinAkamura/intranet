import styled from 'styled-components/macro';
import { Button as ButtonAntd } from 'antd';

export const Button = styled(ButtonAntd)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px !important;
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
