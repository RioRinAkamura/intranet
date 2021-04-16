import { useContext } from 'react';
import { AuthContext } from './Context';
import { UserIdentity } from './provider';

export const useGetIdentity = (): UserIdentity | null => {
  const { authState } = useContext(AuthContext);
  if (authState.identity) return authState.identity;
  return null;
};
