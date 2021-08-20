import styled from 'styled-components/macro';

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { lazyLoad } from 'utils/loadable';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DeviceListPage = lazyLoad(
  () => import('./index'),
  module => module.DeviceListPage,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
