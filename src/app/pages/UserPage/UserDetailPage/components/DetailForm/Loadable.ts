/**
 *
 * Asynchronously loads the component for DetailForm
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DetailForm = lazyLoad(
  () => import('./index'),
  module => module.DetailForm,
);
