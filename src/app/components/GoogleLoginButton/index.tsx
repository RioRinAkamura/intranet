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
import { useGoogleLogin } from './useGoogleLogin';

interface Props {}

export const GoogleLoginButton = (props: Props) => {
  const { t } = useTranslation();
  const { login } = useGoogleLogin();

  const onSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if ('googleId' in response) {
      await login({ access_token: response.tokenId });
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
