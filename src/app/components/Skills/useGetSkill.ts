import React from 'react';
import { api } from 'utils/api';

export const useGetSkills = (
  isCall: boolean = true,
): {
  loading: boolean;
  error?: Error;
  data: any;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [data, setData] = React.useState<any>();

  React.useEffect(() => {
    if (!isCall) return;

    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.skill.list();
        setData(response);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isCall]);
  return {
    loading,
    error,
    data,
  };
};
