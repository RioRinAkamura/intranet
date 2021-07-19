export const STATUS = [
  {
    label: 'Open',
    value: 'Open',
  },
  {
    label: 'Going',
    value: 'Going',
  },
  {
    label: 'Done',
    value: 'Done',
  },
];

export const FORM_RULES = {
  PROJECT: [
    {
      required: true,
      message: 'Please select project',
    },
  ],
  TITLE: [
    {
      required: true,
      message: 'Please enter title',
    },
  ],
  // STOPPED_DATE: [
  //   {
  //     required: true,
  //     message: 'Please select stopped date',
  //   },
  // ],
};
