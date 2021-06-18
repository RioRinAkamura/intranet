/**
 *
 * Asynchronously loads the component for LeaveApplicationDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LeaveApplicationDetailPage = lazyLoad(
  () => import('./index'),
  module => module.LeaveApplicationDetailPage,
);
