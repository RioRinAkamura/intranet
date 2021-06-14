import { lazyLoad } from 'utils/loadable';

export const UserManageDetailPage = lazyLoad(
  () => import('./index'),
  module => module.UserManageDetailPage,
);
