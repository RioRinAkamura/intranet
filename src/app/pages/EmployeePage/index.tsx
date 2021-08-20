import React from 'react';
import { Switch } from 'react-router-dom';

import { PrivatePath } from 'utils/url.const';
import { PrivateRoute } from 'app/components/Auth/Route';

import { EmployeeListPage } from './EmployeeListPage/Loadable';
import { EmployeeDetailPage } from './EmployeeDetailPage/Loadable';

export const EmployeePage: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path={PrivatePath.EMPLOYEES}
        component={EmployeeListPage}
      />
      <PrivateRoute
        path={PrivatePath.EMPLOYEES_CREATE}
        component={EmployeeDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.EMPLOYEES_ID}
        component={EmployeeDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.EMPLOYEES_ID_NOTES}
        component={EmployeeDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.EMPLOYEES_ID_PROJECTS}
        component={EmployeeDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.EMPLOYEES_ID_DEVICES}
        component={EmployeeDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.EMPLOYEES_ID_CHANGELOGS}
        component={EmployeeDetailPage}
      />
    </Switch>
  );
};
