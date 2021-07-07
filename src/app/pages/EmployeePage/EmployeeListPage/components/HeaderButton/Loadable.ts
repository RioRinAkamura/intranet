/**
 *
 * Asynchronously loads the component for HeaderButton
 *
 */

import { lazyLoad } from 'utils/loadable';

export const HeaderButton = lazyLoad(
  () => import('./index'),
  module => module.HeaderButton,
);
