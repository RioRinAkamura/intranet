import { useContext, useEffect } from 'react';
import Toast, { toastTypes } from '.';
import { ToastContext } from './context';

interface ToastHook {
  message: (message?: toastTypes) => void;
}

export const useToast = (): ToastHook => {
  const { setDataToast, data, clicked } = useContext(ToastContext);
  useEffect(() => {
    if (clicked) {
      Toast(data);
    }
  }, [data, clicked]);
  const message = (message?: toastTypes): void => {
    if (message) {
      setDataToast(true, message);
    } else {
      setDataToast(true);
    }
  };
  return { message };
};
