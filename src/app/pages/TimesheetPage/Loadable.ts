import { lazyLoad } from 'utils/loadable';

export const ProjectPage = lazyLoad(
  () => import('./index'),
  module => module.TimesheetPage,
);
