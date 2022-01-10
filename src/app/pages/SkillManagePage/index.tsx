import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivatePath } from 'utils/url.const';
import { PrivateRoute } from 'app/components/Auth/Route';
import { SkillListPage } from './SkillListPage/Loadable';
import { CategoryPage } from './CategoryPage/Loadable';

export const SkillManagePage = () => {
  return (
    <Switch>
      <PrivateRoute exact path={PrivatePath.SKILLS} component={SkillListPage} />
      <PrivateRoute
        exact
        path={PrivatePath.SKILLS_CREATE}
        component={SkillListPage}
      />
      <PrivateRoute
        exact
        path={PrivatePath.SKILLS_CATEGORIES}
        component={CategoryPage}
      />
      <PrivateRoute
        exact
        path={PrivatePath.SKILLS_CATEGORIES_CREATE}
        component={CategoryPage}
      />
    </Switch>
  );
};
