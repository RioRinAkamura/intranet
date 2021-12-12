import {
  Device,
  EmployeeDevice,
  EmployeeDeviceParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Pagination } from '@hdwebsoft/intranet-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleEmployeeDevices = (): {
  loading: boolean;
  error: boolean;
  employeeDevices: Pagination<EmployeeDevice>;
  devices: Device[];
  fetchEmployeeDevices: (employeeId: string) => void;
  fetchDevices: () => void;
  addEmployeeDevice: (employeeId: string, data: EmployeeDeviceParams) => void;
  editEmployeeDevice: (employeeId: string, data: EmployeeDeviceParams) => void;
  deleteEmployeeDevice: (employeeId: string, deviceId: string) => void;
} => {
  const [employeeDevices, setEmployeeDevices] = useState<
    Pagination<EmployeeDevice>
  >({
    count: 0,
    results: [],
    next: '',
    previous: '',
  });
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchEmployeeDevices = useCallback(async (employeeId: string) => {
    try {
      const response = await api.hr.employee.device.list(employeeId);
      setEmployeeDevices(response);
    } catch (error) {
      setError(error);
      console.log('FETCH_EMPLOYEE_DEVICE', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await api.hr.device.list();
      setDevices(response.results);
    } catch (error) {
      setError(error);
      console.log('FETCH_DEVICES', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmployeeDevice = async (
    employeeId: string,
    data: EmployeeDeviceParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.device.create(employeeId, data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const editEmployeeDevice = async (
    employeeId: string,
    data: EmployeeDeviceParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.device.update(employeeId, data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployeeDevice = async (employeeId: string, deviceId: string) => {
    setLoading(true);
    try {
      await api.hr.employee.device.delete(employeeId, deviceId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    employeeDevices,
    devices,
    fetchEmployeeDevices,
    fetchDevices,
    addEmployeeDevice,
    editEmployeeDevice,
    deleteEmployeeDevice,
  };
};
