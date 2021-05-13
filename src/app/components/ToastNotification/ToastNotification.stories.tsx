import React, { useEffect } from 'react';

import { useNotify } from './index';

const NotificationVariant = ['info', 'warning', 'error', 'success'];

interface NotificationProps {
  variant?: string;
}

const Notification: React.FC<NotificationProps> = ({
  variant = NotificationVariant[0],
}) => {
  const { notify } = useNotify();

  useEffect(() => {
    notify({
      type: variant as any,
      message: 'Notification Title',
      description:
        'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      duration: 2,
    });
  }, [notify, variant]);

  return null;
};

export default {
  title: 'Components/Notification',
  component: Notification,
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: NotificationVariant,
      },
    },
  },
} as any;

export const Default = args => <Notification {...args} />;
