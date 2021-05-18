export enum Gender {
  'Male' = 'Male',
  'Female' = 'Female',
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

export interface TagType {
  id: number;
  name: string;
  slug: string;
}

export const antColours = [
  'pink',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'red',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];
