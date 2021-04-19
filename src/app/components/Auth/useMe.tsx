import { UserIdentity } from './types';
import { useGetIdentity } from './useGetIdentity';

/**
 * An alias of useGetIdentity
 * @returns
 */
export const useMe = (): {
  identity?: UserIdentity | null;
  loading: boolean;
  error?: Error;
} => {
  return useGetIdentity();
};
