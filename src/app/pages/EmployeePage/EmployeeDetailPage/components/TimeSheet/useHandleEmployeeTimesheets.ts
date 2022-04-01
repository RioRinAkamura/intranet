import {
  CreateReportQueryParams,
  EmployeeTimesheet,
  Report,
  ReportQueryParams,
  UpdateEmployeeTimesheetQueryParams,
  UpdateReportQueryParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { User } from '@hdwebsoft/intranet-api-sdk/libs/api/user/models';
import {
  Pagination,
  SelectOption,
} from '@hdwebsoft/intranet-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleEmployeeTimesheets = (): {
  loading: boolean;
  error: boolean;
  employeeTimesheets: Pagination<EmployeeTimesheet>;
  employeeReports: Pagination<Report>;
  employeeIdByUser?: User;
  workStatus: SelectOption[];

  getworkStatus: () => Promise<void>;

  fetchEmployeeTimesheets: (employeeId: string) => void;
  fetchEmployeeTimesheetsByDate: (employeeId: string, date: string) => void;

  editEmployeeTimesheet: (
    employeeId: string,
    data: UpdateEmployeeTimesheetQueryParams,
  ) => void;
  deleteEmployeeTimesheet: (employeeId: string, timesheetId: string) => void;
  getEmployeeIdByUser: () => void;

  //REPORT
  fetchEmployeeReport: (employeeId: string) => void;
  fetchEmployeeReportByDate: (employeeId: string, date: string) => void;
  addEmployeeReport: (employeeId: string, data: ReportQueryParams) => void;
  editEmployeeReport: (employeeId: string, data: ReportQueryParams) => void;
  deleteEmployeeReport: (employeeId: string, timesheetId: string) => void;
} => {
  const [employeeTimesheets, setEmployeeTimesheets] = useState<
    Pagination<EmployeeTimesheet>
  >({
    count: 0,
    results: [],
    next: '',
    previous: '',
  });

  const [employeeReports, setEmployeeReports] = useState<Pagination<Report>>({
    count: 0,
    results: [],
    next: '',
    previous: '',
  });
  const [employeeIdByUser, setEmployeeIdByUser] = useState<User>();
  const [workStatus, setWorkStatus] = useState<SelectOption[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchEmployeeTimesheets = useCallback(async (employeeId: string) => {
    setLoading(true);
    try {
      const response = await api.hr.employee.timesheet.list(employeeId);
      setEmployeeTimesheets(response);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeTimesheetsByDate = useCallback(
    async (employeeId: string, date: string) => {
      setLoading(true);
      try {
        const response = await api.hr.employee.timesheet.listByDate(
          employeeId,
          date,
        );
        setEmployeeTimesheets(response);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editEmployeeTimesheet = async (
    employeeId: string,
    data: UpdateEmployeeTimesheetQueryParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.timesheet.update(employeeId, data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployeeTimesheet = async (
    employeeId: string,
    timesheetId: string,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.timesheet.delete(employeeId, timesheetId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //REPORT

  const fetchEmployeeReport = useCallback(async (employeeId: string) => {
    setLoading(true);
    try {
      const response = await api.hr.employee.report.list(employeeId);
      if (response) {
        setEmployeeReports(response);
      }
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeReportByDate = useCallback(
    async (employeeId: string, date: string) => {
      setLoading(true);
      try {
        const response = await api.hr.employee.report.listByDate(
          employeeId,
          date,
        );
        if (response) {
          setEmployeeReports(response);
        }
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addEmployeeReport = async (
    employeeId: string,
    data: CreateReportQueryParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.report.create(employeeId, data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const editEmployeeReport = async (
    employeeId: string,
    data: UpdateReportQueryParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.report.update(employeeId, data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployeeReport = async (employeeId: string, reportId: string) => {
    setLoading(true);
    try {
      await api.hr.employee.report.delete(employeeId, reportId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeIdByUser = async () => {
    setLoading(true);
    try {
      const response = await api.user.me();
      setEmployeeIdByUser(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getworkStatus = useCallback(async () => {
    try {
      const response = await api.hr.employee.timesheet.getWorkStatus();
      if (response) {
        setWorkStatus(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  return {
    loading,
    error,
    employeeTimesheets,
    employeeReports,
    employeeIdByUser,
    workStatus,
    fetchEmployeeTimesheets,
    fetchEmployeeTimesheetsByDate,
    // addEmployeeTimesheet,
    editEmployeeTimesheet,
    deleteEmployeeTimesheet,
    fetchEmployeeReport,
    addEmployeeReport,
    editEmployeeReport,
    deleteEmployeeReport,
    fetchEmployeeReportByDate,
    getEmployeeIdByUser,
    getworkStatus,
  };
};
