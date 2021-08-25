import { EmployeeSkill } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

/* --- STATE --- */
export interface EmployeeDetailsState {
  identity: string;
  loading: boolean;
  error: boolean;
  employeeSkills: {
    loading: boolean;
    error: boolean;
    list: EmployeeSkill[];
  };
}

export interface EmployeeIdentityPayload {
  identity: string;
  loading: boolean;
  error: boolean;
}

export interface EmployeeSkillPayload {
  loading: boolean;
  error: boolean;
  list: EmployeeSkill[];
}
