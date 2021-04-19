export enum Gender {
  'Male' = 'Male',
  'Female' = 'Female',
  '' = '',
}

export enum Status {
  'Single' = 'Single',
  'Married' = 'Married',
}

export enum Type {
  'Full-time' = 'Full-time',
  'Part-time' = 'Part-time',
  'Probation' = 'Probation',
  'Etc' = 'Etc',
}

export interface BankAccounts {
  bank_name: string;
  number: string;
  branch: string;
}

export interface UserProfile {
  id: string;
  avatar: string;
  code: string;
  first_name: string;
  last_name: string;
  dob?: Date;
  gender?: Gender;
  phone: string;
  email: string;
  status: Status;
  id_number?: string;
  issued_date?: Date;
  issued_place?: string;
  social_insurance_no?: string;
  job_title: string;
  type: Type;
  socials: {
    skype: string;
    twitter: string;
    fb: string;
    linkedin: string;
    github: string;
    gitlab: string;
  };
  bank_accounts: BankAccounts[];
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
  pageSizeOptions?: string[];
  showSizeChanger?: boolean;
}

export interface Filters {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
}
