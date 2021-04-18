export interface UserIdentity {
  id: string;
  displayName?: string;
  avatar?: string;
}

/* --- STATE --- */
export interface AuthState {
  authenticated: boolean;
  identity?: UserIdentity | null;
  loading: boolean;
}
