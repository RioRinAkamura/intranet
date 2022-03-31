import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

export enum RoleName {
  ADMIN = 'Admin',
  HUMAN_RESOURCE = 'Human Resource',
  PROJECT_MANAGER = 'Project Manager',
  STAFF = 'Staff',
}

interface Role {
  description: string;
  id?: number;
  name: string;
  role: RoleName;
}

export interface UserIdentity {
  first_name?: string;
  id?: string;
  displayName?: string;
  avatar?: string;
  role?: Role[];
  employee?: Employee;
}

/* --- STATE --- */
export interface AuthState {
  authenticated: boolean;
  identity?: UserIdentity | null;
  loading: boolean;
}
