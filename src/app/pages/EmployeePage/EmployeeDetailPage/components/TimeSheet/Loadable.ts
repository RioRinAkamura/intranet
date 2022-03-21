import { lazyLoad } from 'utils/loadable';

export const TimeSheet = lazyLoad(
  () => import('./index'),
  module => module.TimeSheet,
);