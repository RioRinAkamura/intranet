/**
 *
 * Asynchronously loads the component for ProjectModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProjectModal = lazyLoad(
  () => import('./index'),
  module => module.ProjectModal,
);
