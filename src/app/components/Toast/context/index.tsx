import React from 'react';

interface ToastContextValues {
  data: any;
  setDataToast: (data: any) => void;
}

export const ToastContext = React.createContext<ToastContextValues>({
  data: null,
  setDataToast: (_data: any) => {},
});

const useToastContextProvider = (): ToastContextValues => {
  const [data, setData] = React.useState<any | null>();

  const setDataToast = React.useCallback((data: any) => {
    setData(data);
  }, []);

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
