import { UserIdentity } from '../provider';

/* --- STATE --- */
export interface AuthState {
  authenticated: boolean;
  identity?: UserIdentity;
}

export interface AuthContextProvider {
  authState: AuthState;
}
