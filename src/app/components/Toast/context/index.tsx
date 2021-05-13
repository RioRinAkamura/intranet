import React from 'react';
import { PlacementType, toastTypes, MessageType } from '..';

interface ToastContextValues {
  data: toastTypes;
  clicked: boolean;
  setDataToast: (clicked: boolean, message?: toastTypes) => void;
}

export const ToastContext = React.createContext<ToastContextValues>({
  data: {
    type: 'success',
    message: 'Toast Title',
    duration: 2000,
    placement: 'bottom',
    style: {},
    closable: false,
  },
  clicked: false,
  setDataToast: (_clicked: boolean, _message?: toastTypes) => {},
});

const useToastContextProvider = (): ToastContextValues => {
  const [data, setData] = React.useState<toastTypes>({
    type: MessageType.Success,
    message: 'Toast Title',
    duration: 2000,
    placement: PlacementType.Bottom,
    style: {},
    closable: true,
  });

  const [clicked, setClicked] = React.useState<boolean>(false);

  const setDataToast = React.useCallback(
    (clicked: boolean, message?: toastTypes) => {
      setData({ ...data, ...message });
      setClicked(clicked);
    },
    [data],
  );

  return {
    data,
    clicked,
    setDataToast,
  };
};

export const ToastContextProvider = ({ children }) => {
  const contextValue = useToastContextProvider();
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};
