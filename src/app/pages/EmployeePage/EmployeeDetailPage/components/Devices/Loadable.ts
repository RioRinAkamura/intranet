/**
 *
 * Asynchronously loads the component for Notes
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Device = lazyLoad(
  () => import('./index'),
  module => module.Device,
);
