/**
 *
 * Asynchronously loads the component for AvatarPath
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AvatarPath = lazyLoad(
  () => import('./index'),
  module => module.AvatarPath,
);
