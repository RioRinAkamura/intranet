import { useContext } from 'react';
import { AuthContext } from './Context';

interface IData {
  email: string;
  password: string;
}

interface IUseLogin {
  login: (data: IData) => void;
}

export const useLogin = (): IUseLogin => {
  const { authProvider, setAuthState } = useContext(AuthContext);
  const login = (data: IData) => {
    authProvider.login(data.email, data.password);
    authProvider
      .getIdentity()
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

  return { login };
};
