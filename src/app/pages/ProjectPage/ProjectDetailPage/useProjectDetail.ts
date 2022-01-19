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
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  members: Member[];
  priorities: SelectOption[];
  statuses: SelectOption[];
  monitorings: SelectOption[];
  roles: SelectOption[];
  allocations: number[];
  loading: boolean;
  error?: Error;
  membersAll: SelectOption[];
  projectNoteScores: SelectOption[];
  fetchUser: (search: string) => Promise<Employee[] | undefined>;
  fetchId: (id: string) => Promise<any | undefined>;
  fetchMembers: (id: string) => void;
  getAllMembers: () => void;
  update: (data: any) => Promise<any | undefined>;
  create: (data: any) => void;
  addMember: (projectId: string, data: any) => Promise<any | undefined>;
  getPriorities: () => Promise<void>;
  getStatuses: () => Promise<void>;
  getMonitorings: () => Promise<void>;
  getProjectNoteScores: () => Promise<void>;
  getRoles: () => Promise<void>;
  getAllocations: () => Promise<void>;
} => {
  const { t } = useTranslation();
  const history = useHistory();
  const [members, setMembers] = React.useState<Member[]>([]);
  const [priorities, setPriorities] = React.useState<SelectOption[]>([]);
  const [statuses, setStatuses] = React.useState<SelectOption[]>([]);
  const [monitorings, setMonitorings] = React.useState<SelectOption[]>([]);
  const [projectNoteScores, setProjectNoteScores] = React.useState<
    SelectOption[]
  >([]);
  const [roles, setRoles] = React.useState<SelectOption[]>([]);
  const [allocations, setAllocations] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>();
  const [membersAll, setMembersAll] = React.useState<SelectOption[]>([]);
  const { notify } = useNotify();

  const fetchUser = React.useCallback(async (search: string) => {
    try {
      const response = await api.hr.employee.list(
        search,
        undefined,
        undefined,
        undefined,
        500,
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

  const getAllMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response: Pagination<Employee> = await api.hr.employee.list(
        undefined,
        undefined,
        undefined,
        1,
        500,
      );
      if (response && response.results && response.results.length > 0) {
        const array: SelectOption[] = [];
        response.results.forEach(values => {
          array.push({
            label: `${values.first_name} ${values.last_name}`,
            value: values.id,
          });
        });
        setMembersAll([...array]);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchMembers = React.useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response: Pagination<Member> = await api.hr.project.getMembers(
        id,
        1,
        100,
      );
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

  const getMonitorings = React.useCallback(async () => {
    try {
      const response = await api.hr.project.getMonitorings();
      if (response) {
        setMonitorings(response);
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

  const getProjectNoteScores = React.useCallback(async () => {
    try {
      const response = await api.hr.project.note.getProjectNoteScores();
      if (response) {
        setProjectNoteScores(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  return {
    setMembers,
    members,
    priorities,
    statuses,
    monitorings,
    projectNoteScores,
    roles,
    allocations,
    loading,
    error,
    membersAll,
    fetchUser,
    fetchId,
    fetchMembers,
    update,
    create,
    addMember,
    getAllMembers,
    getPriorities,
    getStatuses,
    getMonitorings,
    getProjectNoteScores,
    getRoles,
    getAllocations,
  };
};
