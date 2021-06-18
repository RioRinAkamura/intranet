import { calcBusinessDays } from 'utils/variable';

export const APPROVAL_STATUS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const WORKING_TYPE = [
  { label: 'Off', value: 'Off' },
  { label: 'Remote', value: 'Remote' },
];

export const FORM_RULES = {
  employee_id: [
    {
      required: true,
      message: 'The employee is required',
    },
  ],
  title: [
    {
      required: true,
      message: 'The title is required',
    },
  ],
  start_date: [
    {
      required: true,
      message: 'The start date is required',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const endDate = getFieldValue('end_date');
        if (endDate && endDate < value) {
          return Promise.reject('the start date must be less than end date');
        }
        return Promise.resolve();
      },
    }),
  ],
  end_date: [
    {
      required: true,
      message: 'Please input test!',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const startDate = getFieldValue('start_date');
        if (startDate && startDate > value) {
          return Promise.reject(
            'The end date must be greater than the start date',
          );
        }
        return Promise.resolve();
      },
    }),
  ],
  working_type: [
    {
      required: true,
      message: 'The working type is required',
    },
  ],
  total_hours: [
    {
      required: true,
      message: 'The total hours is required',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const startDate = getFieldValue('start_date');
        const endDate = getFieldValue('end_date');
        if (startDate && endDate) {
          const totalLeaveDays = calcBusinessDays(
            new Date(startDate),
            new Date(endDate),
          );
          if (value > totalLeaveDays * 8) {
            return Promise.reject(
              `The total hours must be less than total leave days (${
                totalLeaveDays * 8
              } hours)`,
            );
          }
        }
        return Promise.resolve();
      },
    }),
  ],
};
