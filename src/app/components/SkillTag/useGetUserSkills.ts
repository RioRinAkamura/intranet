import { models } from '@hdwebsoft/intranet-api-sdk';
import * as React from 'react';
import { api } from 'utils/api';

type Skills = models.hr.Skill;

export const useGetUserSkills = (
  isCall: boolean = true,
): {
  loading: boolean;
  error?: Error;
  skills: Skills[] | undefined;
} => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(undefined);
  const [skills, setSkills] = React.useState<Skills[] | undefined>();

  React.useEffect(() => {
    if (!isCall) return;

    setLoading(true);
    (async () => {
      try {
        const response = await api.hr.skill.list();
        setSkills(response.results);
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
    skills,
  };
};
