import { UserIdentity } from './provider';
import { useGetIdentity } from './useGetIdentity';

export const useMe = (): UserIdentity | null => {
  const getMe = useGetIdentity();
  return getMe;
};
