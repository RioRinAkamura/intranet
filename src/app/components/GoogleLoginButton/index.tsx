import { LoginMessages } from 'app/pages/Login/messages';
import config from 'config';
import React from 'react';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

interface Props {}

interface Login {
  tokenId: string;
  googleId: string;
}

export const GoogleLoginButton = (props: Props) => {
  const { t } = useTranslation();

  const onSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if ('googleId' in response) {
      const data: Login = {
        tokenId: response.tokenId,
        googleId: response.googleId,
      };
      console.log('login google: ', data);
      // dispatch(actions.loginWithGoogle(data));
    }
  };
  const onFailure = res => {
    console.log('Login fail ', res);
  };

  return (
    <div>
      <GoogleLoginBtn
        className="ant-btn ant-btn-primary ant-btn-lg"
        clientId={config.GOOGLE_CLIENT_ID}
        buttonText={t(LoginMessages.loginGoogleButton())}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
};

const GoogleLoginBtn = styled(GoogleLogin)`
  width: 100%;
  place-content: center;
  div {
    padding: 5px !important;
  }
`;
