export const useGetIdentity = () => {
  return { identity: null, loading: false };
};

export const useAuthState = (): {
  loading: boolean;
  authenticated: boolean;
} => {
  return { loading: false, authenticated: false };
};

export const useGetPermissions = (): void => {};
export const useAuthenticated = (): void => {};
export const useLogin = (): void => {}; // return AuthProvider.login
export const useLogout = (): void => {}; // return AuthProvider.logout
