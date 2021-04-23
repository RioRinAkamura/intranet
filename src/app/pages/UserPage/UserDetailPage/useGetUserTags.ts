import * as React from 'react';
import fakeAPI from '../../../../utils/fakeAPI';
import { TagType } from '../types';

export const useGetUserTags = (): {
  loading: boolean;
  error?: Error;
  tags: TagType[] | undefined;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [tags, setTags] = React.useState<TagType[] | undefined>([]);

  React.useEffect(() => {
    setLoading(true);
    fakeAPI
      .get('/hr/employees/tags')
      .then((response: any) => {
        setTags(response);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return {
    loading,
    error,
    tags,
  };
};
