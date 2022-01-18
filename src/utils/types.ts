import { DatePickerProps, InputProps } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

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

export enum EmployeeProjectStatus {
  'Preparing' = 'Preparing',
  'Going' = 'Going',
  'Released' = 'Released',
  'Archived' = 'Archived',
}

export enum EmployeeDeviceStatus {
  'Assigned' = 'Assigned',
  'Returned' = 'Returned',
}

export enum DeleteType {
  'EMAIL' = 'EMAIL',
  'NAME' = 'NAME',
  'MULTIPLE' = 'MULTIPLE',
}

export interface TagType {
  id: number;
  name: string;
  slug: string;
}

export interface SkillType {
  id: number;
  name: string;
  level: number;
}

export interface MessageTranslate {
  [key: string]: Function;
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

export const inputViewProps: InputProps = {
  bordered: false,
  readOnly: true,
};

export const textareaViewProps: TextAreaProps = {
  bordered: false,
  readOnly: true,
};

export const datePickerViewProps: DatePickerProps = {
  bordered: false,
  inputReadOnly: true,
  allowClear: false,
  suffixIcon: null,
  popupStyle: { display: 'none' },
};
