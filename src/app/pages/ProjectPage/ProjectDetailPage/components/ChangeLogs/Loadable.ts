/**
 *
 * Asynchronously loads the component for ChangeLogs
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ChangeLogs = lazyLoad(
  () => import('./index'),
  module => module.ChangeLogs,
);
