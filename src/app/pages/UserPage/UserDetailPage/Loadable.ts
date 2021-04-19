/**
 *
 * Asynchronously loads the component for UserDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UserDetailPage = lazyLoad(
  () => import('./index'),
  module => module.UserDetailPage,
);
