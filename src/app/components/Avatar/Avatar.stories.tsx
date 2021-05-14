import React from 'react';

import { Avatar } from './index';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    name: {
      defaultValue: 'A B',
    },
  },
} as any;

export const Default = args => <Avatar {...args} />;
