/**
 *
 * Asynchronously loads the component for UserDetailPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProjectPage = lazyLoad(
  () => import('./index'),
  module => module.ProjectPage,
);
