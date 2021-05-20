/**
 *
 * Asynchronously loads the component for TotalSearchForm
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TotalSearchForm = lazyLoad(
  () => import('./index'),
  module => module.TotalSearchForm,
);
