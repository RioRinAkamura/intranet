/**
 *
 * Asynchronously loads the component for ProjectDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProjectDetailPage = lazyLoad(
  () => import('./index'),
  module => module.ProjectDetailPage,
);
