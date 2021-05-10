import * as React from 'react';
import { api } from 'utils/api';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

type Tags = models.hr.Tags;

export const useGetUserTags = (): {
  loading: boolean;
  error?: Error;
  tags: Tags[] | undefined;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [tags, setTags] = React.useState<Tags[] | undefined>();

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.employee.listTags();
        setTags(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return {
    loading,
    error,
    tags,
  };
};
