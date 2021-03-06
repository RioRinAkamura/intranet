import { FacebookFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { LoginMessages } from 'app/pages/Login/messages';
import config from 'config';
import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useFacebookLogin } from './useFacebookLogin';

interface Props {}

export const FacebookLoginButton = (props: Props) => {
  const { t } = useTranslation();
  const { login } = useFacebookLogin();

  const responseFacebook = async response => {
    await login({ access_token: response.accessToken });
  };

  return (
    <div>
      <FacebookLogin
        appId={config.FACEBOOK_APP_ID}
        callback={responseFacebook}
        render={renderProps => (
          <FacebookLoginBtn
            block
            size="large"
            onClick={renderProps.onClick}
            icon={<FacebookFilled style={{ fontSize: 'x-large' }} />}
          >
            {t(LoginMessages.loginFacebookButton())}
          </FacebookLoginBtn>
        )}
      />
    </div>
  );
};

const FacebookLoginBtn = styled(Button)`
  place-content: center;
  background-color: #1378f3;
  color: white;
  :hover,
  :focus {
    background-color: #136df3;
    color: rgba(255, 255, 255, 0.9);
  }
`;
