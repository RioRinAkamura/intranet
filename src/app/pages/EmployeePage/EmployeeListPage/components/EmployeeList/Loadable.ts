/**
 *
 * Asynchronously loads the component for UserList
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EmployeeList = lazyLoad(
  () => import('./index'),
  module => module.EmployeeList,
);
