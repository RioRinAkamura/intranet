import {
  Employee,
  Member,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { cloneDeep, omit } from 'lodash';
import { ProjectDetailMessages } from './messages';
import {
  Pagination,
  SelectOption,
} from '@hdwebsoft/intranet-api-sdk/libs/type';

export const useProjectDetail = (): {
  members: Member[];
  priorities: SelectOption[];
  statuses: SelectOption[];
  roles: SelectOption[];
  allocations: number[];
  loading: boolean;
  error?: Error;
  fetchUser: (search: string) => Promise<Employee[] | undefined>;
  fetchId: (id: string) => Promise<any | undefined>;
  fetchMembers: (id: string) => void;
  update: (data: any) => Promise<any | undefined>;
  create: (data: any) => void;
  addMember: (projectId: string, data: any) => Promise<any | undefined>;
  getPriorities: () => Promise<void>;
  getStatuses: () => Promise<void>;
  getRoles: () => Promise<void>;
  getAllocations: () => Promise<void>;
} => {
  const { t } = useTranslation();
  const history = useHistory();
  const [members, setMembers] = React.useState<Member[]>([]);
  const [priorities, setPriorities] = React.useState<SelectOption[]>([]);
  const [statuses, setStatuses] = React.useState<SelectOption[]>([]);
  const [roles, setRoles] = React.useState<SelectOption[]>([]);
  const [allocations, setAllocations] = React.useState<number[]>([]);
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

  const fetchMembers = React.useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response: Pagination<Member> = await api.hr.project.getMembers(id);
      setMembers(response.results);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = async (projectId: string, values: any) => {
    setLoading(true);
    try {
      const response = await api.hr.project.createMember(projectId, {
        ...values.members,
        project: projectId,
      });
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(ProjectDetailMessages.messageCreateMemberSuccess()),
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

  const getPriorities = React.useCallback(async () => {
    try {
      const response = await api.hr.project.getPriorities();
      if (response) {
        setPriorities(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  const getStatuses = React.useCallback(async () => {
    try {
      const response = await api.hr.project.getStatuses();
      if (response) {
        setStatuses(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  const getRoles = React.useCallback(async () => {
    try {
      const response = await api.hr.project.getProjectRoles();
      if (response) {
        setRoles(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  const getAllocations = React.useCallback(async () => {
    try {
      const response = await api.hr.project.getAllocations();
      if (response) {
        setAllocations(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  return {
    members,
    priorities,
    statuses,
    roles,
    allocations,
    loading,
    error,
    fetchUser,
    fetchId,
    fetchMembers,
    update,
    create,
    addMember,
    getPriorities,
    getStatuses,
    getRoles,
    getAllocations,
  };
};
