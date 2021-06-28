export const STATUS = [
  {
    label: 'Available',
    value: 'available',
  },
  {
    label: 'Unavailalbe',
    value: 'unavailable',
  },
];

export const statusStr = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
};

export const EMPLOYEE_DEVICE_STATUS = [
  {
    label: 'Assigned',
    value: 'assigned',
  },
  {
    label: 'Returned',
    value: 'returned',
  },
];

export const HEALTH_STATUS = [
  {
    label: 'Good',
    value: 'good',
  },
  {
    label: 'Bad',
    value: 'bad',
  },
];

export const FORM_RULES = {
  DEVICE: [
    {
      required: true,
      message: 'Please select device',
    },
  ],
  STATED_DATE: [
    {
      required: true,
      message: 'Please select started date',
    },
  ],
  // STOPPED_DATE: [
  //   {
  //     required: true,
  //     message: 'Please select stopped date',
  //   },
  // ],
  CODE: [
    {
      required: true,
      message: 'Please enter device code',
    },
  ],
  CATEGORY: [
    {
      required: true,
      message: 'Please select category',
    },
  ],
  SINCE: [
    {
      required: true,
      message: 'Please select device date',
    },
  ],
  HEALTH_STATUS: [
    {
      required: true,
      message: 'Please select health status',
    },
  ],
  STATUS: [
    {
      required: true,
      message: 'Please select status',
    },
  ],
};
