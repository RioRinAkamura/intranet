import React, { useEffect } from 'react';

import { useNotify } from './index';

type NotificationVariant = 'info' | 'warning' | 'error' | 'success';

interface NotificationProps {
  variant?: NotificationVariant;
}

const Notification: React.FC<NotificationProps> = ({
  variant = 'info',
  ...restProps
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
} as any;

export const Default = args => <Notification {...args} />;
