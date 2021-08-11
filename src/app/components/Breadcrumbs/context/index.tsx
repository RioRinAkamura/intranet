import React from 'react';

interface BreadCrumbContextValue {
  breadCrumb: string;
  setBreadCrumb: (data: string) => void;
}

export const BreadCrumbContext = React.createContext<BreadCrumbContextValue>({
  breadCrumb: '',
  setBreadCrumb: (data: string) => {},
});

const UseBreadCrumbContextProvider = (): BreadCrumbContextValue => {
  const [breadCrumb, setBreadCrumb] = React.useState<string>('');
  return {
    breadCrumb,
    setBreadCrumb,
  };
};

export const BreadCrumbsContextProvider = ({ children }) => {
  const contextValue = UseBreadCrumbContextProvider();
  return (
    <BreadCrumbContext.Provider value={contextValue}>
      {children}
    </BreadCrumbContext.Provider>
  );
};

export const useBreadCrumbContext = () =>
  (React.useContext(BreadCrumbContext) as unknown) as BreadCrumbContextValue;
