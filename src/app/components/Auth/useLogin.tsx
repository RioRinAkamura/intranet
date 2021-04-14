import { useContext } from 'react';
import { AuthContext } from './Context';
import { useAuthProvider } from './useAuthProvider';

interface Data {
  email: string;
  password: string;
}

interface LoginPayload {
  userLogin: (data: Data) => void;
}

export const useLogin = (): LoginPayload => {
  const { setAuthState } = useContext(AuthContext);
  const { login, getIdentity } = useAuthProvider();
  const userLogin = (data: Data) => {
    login(data.email, data.password);
    getIdentity()
      .then(response => {
        setAuthState({
          authenticated: true,
          identity: response,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return { userLogin };
};
