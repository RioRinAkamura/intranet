import config from 'config';
import React from 'react';
import { GoogleLogout } from 'react-google-login';

export function Logout() {
  const onSuccess = () => {
    console.log('Logout success ');
  };

  return (
    <div>
      <GoogleLogout
        clientId={config.GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}
