/**
 *
 * Asynchronously loads the component for LeaveApplicationDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DeviceDetailPage = lazyLoad(
  () => import('./index'),
  module => module.DeviceDetailPage,
);
