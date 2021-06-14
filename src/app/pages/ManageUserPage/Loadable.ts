import { lazyLoad } from 'utils/loadable';

export const ManageUserPage = lazyLoad(
  () => import('./index'),
  module => module.ManageUserPage,
);
