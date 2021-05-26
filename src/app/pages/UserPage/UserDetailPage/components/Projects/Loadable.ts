/**
 *
 * Asynchronously loads the component for Projects
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Projects = lazyLoad(
  () => import('./index'),
  module => module.Projects,
);
