// import React from 'react';
import { notification } from 'antd';

export enum ToastMessageType {
  Info = 'info',
  Warn = 'warning',
  Error = 'error',
}
interface ToastMessage {
  type: ToastMessageType;
  message?: string;
  description?: string;
  className?: string;
  duration?: number;
}

export const useNotify = (): {
  notify: (message: ToastMessage) => void;
} => {
  const notify = (message: ToastMessage): void => {
    notification[message.type]({
      message: message.message,
      description: message.description,
      className: message.className,
      duration: message.duration,
    });
  };
  return { notify };
};
