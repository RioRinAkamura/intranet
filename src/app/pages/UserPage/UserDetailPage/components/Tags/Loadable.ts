/**
 *
 * Asynchronously loads the component for SocialNetwork
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TagUser = lazyLoad(
  () => import('./index'),
  module => module.Tags,
);
