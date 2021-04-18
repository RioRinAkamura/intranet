export interface UserIdentity {
  id: string;
  displayName?: string;
  avatar?: string;
}

export interface AuthProvider {
  // authentication
  login: (username: string, password: string) => void;
  checkError: (error: Error) => void;
  checkAuth: () => Promise<UserIdentity>;
  logout: () => void;
  getIdentity: () => Promise<UserIdentity>;
  // authorization
  getPermissions: () => void;
}

const defaultIdentity: UserIdentity = { id: '' };

export const defaultProvider: AuthProvider = {
  login: (): Promise<void> => Promise.resolve(),
  logout: (): Promise<void> => Promise.resolve(),
  checkAuth: (): Promise<UserIdentity> => Promise.resolve(defaultIdentity),
  checkError: (): Promise<void> => Promise.resolve(),
  getPermissions: (): Promise<void> => Promise.resolve(),
  getIdentity: (): Promise<UserIdentity> => Promise.resolve(defaultIdentity),
};
