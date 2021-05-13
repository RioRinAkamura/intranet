/**
 *
 * Asynchronously loads the component for AddBankModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AddBankModal = lazyLoad(
  () => import('./index'),
  module => module.AddBankModal,
);
