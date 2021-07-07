/**
 *
 * Asynchronously loads the component for SocialNetwork
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SocialNetwork = lazyLoad(
  () => import('./index'),
  module => module.SocialNetwork,
);
