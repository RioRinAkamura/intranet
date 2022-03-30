import React from 'react';
import { Switch } from 'react-router-dom';

import { PrivatePath } from 'utils/url.const';

import { PrivateRoute } from 'app/components/Auth/Route';
import { TimesheetListPage } from './TimesheetListPage';

export const TimesheetPage: React.FC = () => {
  return (
    <>
      <Switch>
        <PrivateRoute
          path={PrivatePath.PROJECTS_TIMESHEETS}
          component={TimesheetListPage}
        />
      </Switch>
    </>
  );
};
