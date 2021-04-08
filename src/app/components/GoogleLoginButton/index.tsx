import config from 'config';
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { useAuthSlice } from '../Auth/slice';

export function GoogleLoginButton() {
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();

  const onSuccess = res => {
    const data = {
      token: res.tokenId,
      userId: res.googleId,
    };
    dispatch(actions.loginWithGoogle(data));
  };
  const onFailure = res => {
    console.log('Login fail ', res);
  };

  return (
    <div>
      <GoogleLoginBtn
        className="ant-btn ant-btn-primary ant-btn-lg"
        clientId={config.GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

const GoogleLoginBtn = styled(GoogleLogin)`
  width: 100%;
  place-content: center;
  div {
    padding: 5px !important;
  }
`;
