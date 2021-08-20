import React from 'react';
import styled from 'styled-components/macro';

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { lazyLoad } from '../../../../utils/loadable';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmployeeListPage = lazyLoad(
  () => import('./index'),
  module => module.EmployeeListPage,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
