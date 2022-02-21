import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { UserIdentity } from './types';
import { useAuthProvider } from './useAuthProvider';

export const useGetIdentity = (): {
  identity?: UserIdentity | null;
  loading: boolean;
  error?: Error;
  setIdentity: Dispatch<SetStateAction<UserIdentity | null | undefined>>;
} => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [identity, setIdentity] = useState<UserIdentity | null>();
  const authProvider = useAuthProvider();
  useEffect(() => {
    (async () => {
      try {
        const user = await authProvider.getIdentity();
        setIdentity(user);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [authProvider]);

  return { loading, identity, error, setIdentity };
};
