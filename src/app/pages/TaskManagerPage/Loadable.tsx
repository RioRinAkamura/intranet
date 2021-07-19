import { lazyLoad } from 'utils/loadable';

export const TaskManagerPage = lazyLoad(
  () => import('./index'),
  module => module.TaskManager,
);
