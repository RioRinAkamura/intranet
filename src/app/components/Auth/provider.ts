import { api } from 'utils/sessionConfig';

export interface UserIdentity {
  id: string;
  displayName?: string;
  avatar?: string;
}

export interface AuthProvider {
  // authentication
  login: (username: string, password: string) => void;
  checkError: (error: Error) => void;
  checkAuth: () => void;
  logout: () => void;
  getIdentity: () => Promise<UserIdentity>;
  // authorization
  getPermissions: () => void;
}

const defaultIdentity: UserIdentity = { id: '' };

export const defaultProvider: AuthProvider = {
  login: (): Promise<void> => Promise.resolve(),
  logout: (): Promise<void> => Promise.resolve(),
  checkAuth: (): Promise<void> => Promise.resolve(),
  checkError: (): Promise<void> => Promise.resolve(),
  getPermissions: (): Promise<void> => Promise.resolve(),
  getIdentity: (): Promise<UserIdentity> => Promise.resolve(defaultIdentity),
};

export const customProvider: AuthProvider = {
  login: async (username: string, password: string): Promise<void> => {
    await api.auth.login(username, password);
  },
  logout: (): Promise<void> => Promise.resolve(),
  checkAuth: (): Promise<void> => Promise.resolve(),
  checkError: (): Promise<void> => Promise.resolve(),
  getPermissions: (): Promise<void> => Promise.resolve(),
  getIdentity: async (): Promise<UserIdentity> => {
    const identify = await api.user.me();
    console.log('identify', identify);

    return defaultIdentity;
  },
};
