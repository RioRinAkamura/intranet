import { UserIdentity } from './types';

export interface AuthProvider {
  // authentication
  login: (username: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  getIdentity: () => Promise<UserIdentity | null>;
}

export const defaultProvider: AuthProvider = {
  login: (): Promise<void> => Promise.resolve(),
  logout: (): Promise<void> => Promise.resolve(),
  checkAuth: (): Promise<boolean> => Promise.resolve(false),
  getIdentity: (): Promise<UserIdentity | null> => Promise.resolve(null),
};
