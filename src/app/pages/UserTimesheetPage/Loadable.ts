import { lazyLoad } from 'utils/loadable';

export const UserTimesheetPage = lazyLoad(
  () => import('./index'),
  module => module.UserTimesheetPage,
);
