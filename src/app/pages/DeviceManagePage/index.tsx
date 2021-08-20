import React from 'react';
import { Switch } from 'react-router-dom';

import { PrivatePath } from 'utils/url.const';
import { PrivateRoute } from 'app/components/Auth/Route';

import { DeviceListPage } from './DeviceListPage/Loadable';
import { DeviceDetailPage } from './DeviceDetailPage/Loadable';

export const DeviceManagePage: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path={PrivatePath.DEVICES}
        component={DeviceListPage}
      />
      <PrivateRoute
        path={PrivatePath.DEVICES_CREATE}
        component={DeviceDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.DEVICES_ID}
        component={DeviceDetailPage}
      />
      <PrivateRoute
        path={PrivatePath.DEVICES_ID_HISTORY}
        component={DeviceDetailPage}
      />
    </Switch>
  );
};
