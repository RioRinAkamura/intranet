import { useHistory } from 'react-router-dom';
import { UserDetailMessages } from './messages';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from 'utils/api';
import { SelectOption } from '@hdwebsoft/intranet-api-sdk/libs/type';

export const useHandleEmployeeDetail = (): {
  loading: boolean;
  error?: Error;
  user: Employee | undefined;
  positions: SelectOption[] | undefined;
  monitorings: SelectOption[];
  types: SelectOption[] | undefined;
  bankNames: SelectOption[] | undefined;
  employeeNoteScores: SelectOption[];
  getEmployeeNoteScores: () => Promise<void>;
  getDetail: (id: string) => Promise<void>;
  getPositions: () => Promise<void>;
  getTypes: () => Promise<void>;
  getBankNames: () => Promise<void>;
  getMonitorings: () => Promise<void>;
  update: (data: Employee) => Promise<Employee | undefined>;
  create: (data: Employee) => Promise<void>;
} => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [user, setUser] = useState<Employee | undefined>();
  const [positions, setPositions] = useState<SelectOption[]>([]);
  const [monitorings, setMonitorings] = useState<SelectOption[]>([]);
  const [employeeNoteScores, setEmployeeNoteScores] = useState<SelectOption[]>(
    [],
  );
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [bankNames, setBankNames] = useState<SelectOption[]>([]);
  const { notify } = useNotify();
  const history = useHistory();

  const getDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.hr.employee.get(id);

      if (response) {
        setUser(response);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = async (data: Employee): Promise<Employee | undefined> => {
    setLoading(true);
    try {
      const response = await api.hr.employee.update(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(UserDetailMessages.updateSuccessMessage()),
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

  const create = async (data: Employee) => {
    setLoading(true);
    try {
      const response = await api.hr.employee.create(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: t(UserDetailMessages.updateSuccessMessage()),
        });
        history.push('/employees/' + response.id);
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

  const getPositions = useCallback(async () => {
    try {
      const response = await api.hr.employee.getPositions();
      if (response) {
        setPositions(response);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTypes = useCallback(async () => {
    try {
      const response = await api.hr.employee.getTypes();
      if (response) {
        setTypes(response);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBankNames = useCallback(async () => {
    try {
      const response = await api.hr.employee.getBankNames();
      if (response) {
        setBankNames(response);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMonitorings = useCallback(async () => {
    try {
      const response = await api.hr.employee.getMonitorings();
      if (response) {
        setMonitorings(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  const getEmployeeNoteScores = useCallback(async () => {
    try {
      const response = await api.hr.employee.note.getEmployeeNoteScores();
      if (response) {
        setEmployeeNoteScores(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  return {
    loading,
    error,
    user,
    positions,
    types,
    bankNames,
    monitorings,
    employeeNoteScores,
    getEmployeeNoteScores,
    getDetail,
    getPositions,
    getTypes,
    getBankNames,
    getMonitorings,
    update,
    create,
  };
};
