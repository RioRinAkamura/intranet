/**
 *
 * Asynchronously loads the component for ProjectList
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProjectList = lazyLoad(
  () => import('./index'),
  module => module.ProjectList,
);
