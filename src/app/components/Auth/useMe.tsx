import { useContext } from 'react';
import { AuthContext } from './Context';
import { UserIdentity } from './provider';

export const useMe = (): UserIdentity | null => {
  const { authState } = useContext(AuthContext);
  if (authState.identity) return authState.identity;
  else return null;
};
