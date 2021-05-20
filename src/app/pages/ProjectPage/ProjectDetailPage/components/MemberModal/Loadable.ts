/**
 *
 * Asynchronously loads the component for MemberModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MemberModal = lazyLoad(
  () => import('./index'),
  module => module.MemberModal,
);
