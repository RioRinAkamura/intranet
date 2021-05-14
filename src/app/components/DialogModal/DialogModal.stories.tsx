import React from 'react';

import { DialogModal } from './index';

export default {
  title: 'Components/DialogModal',
  component: DialogModal,
  argTypes: {
    isOpen: { defaultValue: true },
    title: { defaultValue: 'Dialog title' },
    cancelText: { defaultValue: 'Cancel' },
    okText: { defaultValue: 'OK' },
    handleSubmit: { action: 'Submitted' },
    handleCancel: { action: 'Canceled' },
  },
} as any;

export const Default = args => (
  <DialogModal {...args}>Dialog content</DialogModal>
);
