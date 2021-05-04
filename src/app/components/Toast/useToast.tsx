import { useContext } from 'react';
import Toast, { toastTypes } from '.';
import { ToastContext } from './context';

export const useToast = () => {
  const { setDataToast, data } = useContext(ToastContext);
  console.log('data', data);

  const toast = (props?: toastTypes) => {
    if (props) {
      setDataToast(props);
    }
    return Toast();
  };

  return { toast };
};
