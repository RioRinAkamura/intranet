/**
 *
 * Asynchronously loads the component for UserDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EmployeePage = lazyLoad(
  () => import('./index'),
  module => module.EmployeePage,
);
