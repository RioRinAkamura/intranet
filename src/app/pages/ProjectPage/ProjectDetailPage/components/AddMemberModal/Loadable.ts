/**
 *
 * Asynchronously loads the component for AddMemberModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AddMemberModal = lazyLoad(
  () => import('./index'),
  module => module.AddMemberModal,
);
