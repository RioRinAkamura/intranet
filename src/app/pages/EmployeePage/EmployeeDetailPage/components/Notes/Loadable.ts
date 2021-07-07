/**
 *
 * Asynchronously loads the component for Notes
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Notes = lazyLoad(
  () => import('./index'),
  module => module.Notes,
);
