import config from 'config';
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAuthSlice } from '../Auth/slice';

export function Login() {
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();

  const onSuccess = res => {
    const data = {
      token: res.tokenId,
      userId: res.googleId,
    };
    dispatch(actions.loginWithGoogle({ authenticated: true }));
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
  div {
    padding: 5px !important;
  }
`;
