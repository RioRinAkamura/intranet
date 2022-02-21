import { api } from 'utils/api';
import { AuthProvider } from './authProvider';
import { UserIdentity } from './types';

export const authProvider: AuthProvider = {
  login: async (username: string, password: string): Promise<void> => {
    await api.auth.login(username, password);
  },
  logout: async (): Promise<void> => api.auth.logout(),
  checkAuth: async (): Promise<boolean> => {
    const me = await api.user.me();
    return Boolean(me);
  },
  getIdentity: async (): Promise<UserIdentity> => api.user.me() as UserIdentity,
};

export default authProvider;
