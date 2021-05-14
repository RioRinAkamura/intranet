import React from 'react';

import { DeleteModal } from './index';

export default {
  title: 'Components/DeleteModal',
  component: DeleteModal,
  argTypes: {
    open: { defaultValue: true },
    cancelText: { defaultValue: 'Cancel' },
    deleteText: { defaultValue: 'Delete' },
    content: { defaultValue: 'Are you sure you want to delete your account?' },
    handleDelete: { action: 'Deleted' },
    handleCancel: { action: 'Canceled' },
  },
} as any;

export const Default = args => <DeleteModal {...args} />;
