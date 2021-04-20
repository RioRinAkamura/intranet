/**
 *
 * Asynchronously loads the component for UserList
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UserList = lazyLoad(
  () => import('./index'),
  module => module.UserList,
);
