import { lazyLoad } from 'utils/loadable';

export const TimesheetPage = lazyLoad(
  () => import('./index'),
  module => module.TimesheetPage,
);
