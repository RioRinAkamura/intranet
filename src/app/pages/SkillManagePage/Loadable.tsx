import { lazyLoad } from 'utils/loadable';

export const SkillManagePage = lazyLoad(
  () => import('./index'),
  module => module.SkillManagePage,
);
