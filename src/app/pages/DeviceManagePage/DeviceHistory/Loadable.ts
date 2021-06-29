/**
 *
 * Asynchronously loads the component for LeaveApplicationDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DeviceHistoryTab = lazyLoad(
  () => import('./index'),
  module => module.DeviceHistory,
);
