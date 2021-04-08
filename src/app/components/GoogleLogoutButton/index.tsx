import config from 'config';
import React from 'react';
import { GoogleLogout } from 'react-google-login';
import styled from 'styled-components/macro';

export function Logout() {
  const onSuccess = () => {
    console.log('Logout success ');
  };

  return (
    <div>
      <GoogleLogoutBtn
        clientId={config.GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

const GoogleLogoutBtn = styled(GoogleLogout)`
  width: 100%;
  place-content: center;
  div {
    padding: 5px !important;
  }
`;
