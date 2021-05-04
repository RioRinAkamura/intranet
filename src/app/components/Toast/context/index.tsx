import React from 'react';
import { PlacementType, toastTypes, MessageType } from '..';

interface ToastContextValues {
  data: toastTypes;
  setDataToast: (data: toastTypes | null) => void;
}

export const ToastContext = React.createContext<ToastContextValues>({
  data: {
    type: MessageType.Success,
    message: 'Toast Title',
    duration: 2000,
    placement: PlacementType.Bottom,
    style: {},
    closable: false,
  },
  setDataToast: (_data: toastTypes | null) => {},
});

const useToastContextProvider = (): ToastContextValues => {
  const [data, setData] = React.useState<toastTypes>({
    type: MessageType.Success,
    message: 'Toast Title',
    duration: 2000,
    placement: PlacementType.Bottom,
    style: {},
    closable: false,
  });

  const setDataToast = React.useCallback(
    (newData: toastTypes | null) => {
      setData({ ...data, ...newData });
    },
    [data],
  );

  return {
    data,
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
