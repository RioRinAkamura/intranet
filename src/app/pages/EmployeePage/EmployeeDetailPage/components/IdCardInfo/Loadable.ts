/**
 *
 * Asynchronously loads the component for IdCardInfo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const IdCardInfo = lazyLoad(
  () => import('./index'),
  module => module.IdCardInfo,
);
