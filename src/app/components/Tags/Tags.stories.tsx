import React from 'react';

import { TagsInput } from './index';

const Items = ['VN', 'US', 'UK'];

export default {
  title: 'Components/Tags',
  component: TagsInput,
} as any;

export const Default = args => {
  const [selectedKeys, setSelectedKeys] = React.useState(Items);

  return (
    <TagsInput
      {...args}
      placeholder="Select"
      value={selectedKeys}
      callback={e => {
        setSelectedKeys(e);
      }}
    />
  );
};
