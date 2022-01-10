import { lazyLoad } from 'utils/loadable';

export const CategoryPage = lazyLoad(
  () => import('./index'),
  module => module.CategoryPage,
);
