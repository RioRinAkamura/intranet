import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { cloneDeep, omit } from 'lodash';
import { ProjectDetailMessages } from './messages';

export const useProjectDetail = (): {
  loading: boolean;
  error?: Error;
  fetchUser: (search: string) => Promise<Employee[] | undefined>;
  fetchId: (id: string) => Promise<any | undefined>;
  update: (data: any) => Promise<any | undefined>;
  create: (data: any) => void;
} => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>();
  const { notify } = useNotify();

  const fetchUser = React.useCallback(async (search: string) => {
    try {
      const response = await api.hr.employee.list(
        search,
        undefined,
        undefined,
        undefined,
        6,
      );
      return response.results;
    } catch (error) {
      setError(error);
    }
  }, []);

  const fetchId = React.useCallback(async (id: string) => {
    try {
      const response: any = await api.hr.project.get(id);
      return response;
    } catch (error) {
      setError(error);
    }
  }, []);

  const update = async (values: any): Promise<any | undefined> => {
    setLoading(true);
    try {
      const data: any = cloneDeep(omit(values, 'members'));

      const response = await api.hr.project.update(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(ProjectDetailMessages.messageEditProjectSuccess()),
        });
        return response;
      }
    } catch (error: any) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const create = async (values: any) => {
    setLoading(true);
    try {
      const data = cloneDeep(values);
      if (data.members && data.members.length > 0) {
        data.members.map(member => {
          member.employee = member.employee.id;
          member.allocation = parseFloat(member.allocation).toFixed(1);
          return member;
        });
      }
      const response: any = await api.hr.project.create(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(ProjectDetailMessages.messageCreateProjectSuccess()),
        });
        history.push('/projects/' + response.id + '/members/add');
      }
    } catch (error: any) {
      setError(error);
      notify({
        type: ToastMessageType.Error,
        duration: 2,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    fetchUser,
    fetchId,
    update,
    create,
  };
};
