import React from 'react';

import { DeleteConfirmModal } from './index';

export default {
  title: 'Components/DeleteConfirmModal',
  component: DeleteConfirmModal,
  args: {
    visible: {
      defaultValue: true,
    },
    answer: 'admin',
    description: <p>This will permanently delete and cannot be undone.</p>,
  },
} as any;

export const Default = args => (
  <DeleteConfirmModal
    {...args}
    handleCancel={() => console.log('Canceled')}
    handleOk={() => console.log('Submitted')}
  />
);
