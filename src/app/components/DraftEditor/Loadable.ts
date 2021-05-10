/**
 *
 * Asynchronously loads the component for DraftEditor
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DraftEditor = lazyLoad(
  () => import('./index'),
  module => module.DraftEditor,
);
