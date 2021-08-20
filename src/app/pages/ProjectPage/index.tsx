import React from 'react';
import { Switch } from 'react-router-dom';

import { PrivatePath } from 'utils/url.const';

import { PrivateRoute } from 'app/components/Auth/Route';
import { ProjectListPage } from './ProjectListPage/Loadable';
import { ProjectDetailPage } from './ProjectDetailPage/Loadable';

export const ProjectPage: React.FC = () => {
  return (
    <>
      <Switch>
        <PrivateRoute
          exact
          path={PrivatePath.PROJECTS}
          component={ProjectListPage}
        />
        <PrivateRoute
          path={PrivatePath.PROJECTS_CREATE}
          component={ProjectDetailPage}
        />
        <PrivateRoute
          path={PrivatePath.PROJECTS_ID_MEMBERS}
          component={ProjectListPage}
        />
        <PrivateRoute
          path={PrivatePath.PROJECTS_ID_MEMBERS_ADD}
          component={ProjectListPage}
        />
        <PrivateRoute
          path={PrivatePath.PROJECTS_ID}
          component={ProjectDetailPage}
        />
        <PrivateRoute
          path={PrivatePath.PROJECTS_ID_CHANGELOGS}
          component={ProjectDetailPage}
        />
      </Switch>
    </>
  );
};
