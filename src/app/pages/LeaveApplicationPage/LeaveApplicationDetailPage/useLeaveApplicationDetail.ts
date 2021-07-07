import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import * as React from 'react';
import { useHistory } from 'react-router';
import { api } from 'utils/api';
import { cloneDeep } from 'lodash';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

type Employee = models.hr.Employee;

export const useLeaveApplicationDetail = (): {
  loading: boolean;
  error?: Error;
  fetchEmployees: () => Promise<Employee[] | undefined>;
  detail: (id: string) => Promise<any | undefined>;
  update: (data: any) => Promise<any | undefined>;
  approve: (id: string) => Promise<any | undefined>;
  reject: (id: string) => Promise<any | undefined>;
  create: (data: any) => void;
} => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const { notify } = useNotify();

  const detail = React.useCallback(async (id: string) => {
    return await api.hr.employeeLeave.get(id);
  }, []);

  const fetchEmployees = React.useCallback(async () => {
    return (await api.hr.employee.list()).results;
  }, []);

  const update = async (values: any): Promise<any | undefined> => {
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
      const response = await api.hr.employeeLeave.update(data.id, data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Save successful',
        });
        return response;
      }
    } catch (error) {
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
      const response: any = await api.hr.employeeLeave.create(data);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Create successful',
        });
        history.push('/leave_applications/' + response.id);
      }
    } catch (error) {
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

  const approve = async (id: string) => {
    setLoading(true);
    try {
      const response: any = await api.hr.employeeLeave.approve(id);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Approve successful',
        });
        history.push('/leave_applications/');
      }
    } catch (error) {
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

  const reject = async (id: string) => {
    setLoading(true);
    try {
      const response: any = await api.hr.employeeLeave.approve(id);
      if (response) {
        notify({
          type: ToastMessageType.Info,
          duration: 2,
          message: 'Reject successful',
        });
        history.push('/leave_applications/');
      }
    } catch (error) {
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
    fetchEmployees,
    detail,
    update,
    create,
    approve,
    reject,
  };
};
