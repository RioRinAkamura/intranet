import { api } from 'utils/sessionConfig';
import { AuthProvider, UserIdentity } from './provider';

export const customProvider: AuthProvider = {
  login: async (username: string, password: string): Promise<void> => {
    await api.auth.login(username, password);
  },
  logout: async (): Promise<void> => {
    await api.auth.logout();
  },
  checkAuth: async (): Promise<UserIdentity> => {
    const identify = await api.user.me();
    return identify;
  },
  checkError: (): Promise<void> => Promise.resolve(),
  getPermissions: (): Promise<void> => Promise.resolve(),
  getIdentity: async (): Promise<UserIdentity> => {
    const identify = await api.user.me();
    return identify;
  },
};
