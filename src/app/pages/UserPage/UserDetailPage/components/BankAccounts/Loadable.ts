/**
 *
 * Asynchronously loads the component for BankAccounts
 *
 */

import { lazyLoad } from 'utils/loadable';

export const BankAccounts = lazyLoad(
  () => import('./index'),
  module => module.BankAccounts,
);
