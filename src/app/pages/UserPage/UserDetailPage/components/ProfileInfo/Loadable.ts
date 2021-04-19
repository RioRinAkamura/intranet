/**
 *
 * Asynchronously loads the component for ProfileInfo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProfileInfo = lazyLoad(
  () => import('./index'),
  module => module.ProfileInfo,
);
