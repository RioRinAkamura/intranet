/**
 *
 * Asynchronously loads the component for UserDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DeviceManagePage = lazyLoad(
  () => import('./index'),
  module => module.DeviceManagePage,
);
