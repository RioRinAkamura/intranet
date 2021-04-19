/**
 *
 * Asynchronously loads the component for JobInfo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const JobInfo = lazyLoad(
  () => import('./index'),
  module => module.JobInfo,
);
