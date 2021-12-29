import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { CardLayout } from 'app/components/CardLayout';

export const StyledLink = styled(Link)`
  white-space: pre-wrap;
  :hover {
    text-decoration: underline;
  }
`;

export const Wrapper = styled(CardLayout)`
  margin-top: 0;
`;
