/**
 *
 * Asynchronously loads the component for UserDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EmployeeEditPage = lazyLoad(
  () => import('./index'),
  module => module.EmployeeEditPage,
);
