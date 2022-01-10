import { lazyLoad } from 'utils/loadable';

export const SkillListPage = lazyLoad(
  () => import('./index'),
  module => module.SkillListPage,
);
