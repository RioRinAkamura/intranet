/**
 *
 * Asynchronously loads the component for SearchUsers
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SearchUsers = lazyLoad(
  () => import('./index'),
  module => module.SearchUsers,
);
