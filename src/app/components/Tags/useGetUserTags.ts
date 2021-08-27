import * as React from 'react';
import { api } from 'utils/api';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

type Tags = models.hr.Tags;

export const useGetUserTags = (
  isCall: boolean = true,
): {
  loading: boolean;
  error?: Error;
  tags: Tags[] | undefined;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [tags, setTags] = React.useState<Tags[] | undefined>();

  React.useEffect(() => {
    if (!isCall) return;

    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.tag.list();
        setTags(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [isCall]);
  return {
    loading,
    error,
    tags,
  };
};
