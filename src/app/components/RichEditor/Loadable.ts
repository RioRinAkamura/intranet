/**
 *
 * Asynchronously loads the component for RichEditor
 *
 */

import { lazyLoad } from 'utils/loadable';

export const RichEditor = lazyLoad(
  () => import('./index'),
  module => module.RichEditor,
);
