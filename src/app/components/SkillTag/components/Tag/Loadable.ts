/**
 *
 * Asynchronously loads the component for Tags
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Tags = lazyLoad(
  () => import('./index'),
  module => module.TagComponent,
);
