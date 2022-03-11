import {
  CreateReportQueryParams,
  EmployeeTimesheet,
  EmployeeTimesheetQueryParams,
  Report,
  ReportQueryParams,
  UpdateReportQueryParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timeSheet/models';
import { Pagination } from '@hdwebsoft/intranet-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleEmployeeTimesheets = (): {
  loading: boolean;
  error: boolean;
  employeeTimesheets: Pagination<EmployeeTimesheet>;
  employeeReports: Pagination<Report>;
  fetchEmployeeTimesheets: (employeeId: string) => void;
  addEmployeeTimesheet: (
    employeeId: string,
    data: EmployeeTimesheetQueryParams,
  ) => void;
  editEmployeeTimesheet: (
    employeeId: string,
    data: EmployeeTimesheetQueryParams,
  ) => void;
  deleteEmployeeTimesheet: (employeeId: string, timesheetId: string) => void;
  //REPORT
  fetchEmployeeReport: (employeeId: string) => void;
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

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchEmployeeTimesheets = useCallback(async (employeeId: string) => {
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

  const addEmployeeTimesheet = async (
    employeeId: string,
    data: EmployeeTimesheetQueryParams,
  ) => {
    setLoading(true);
    try {
      // await api.hr.employee.timesheet.create(employeeId, data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const editEmployeeTimesheet = async (
    employeeId: string,
    data: EmployeeTimesheetQueryParams,
  ) => {
    setLoading(true);
    try {
      // await api.hr.employee.timesheet.update(employeeId, data);
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

  const deleteEmployeeReport = async (
    employeeId: string,
    timesheetId: string,
  ) => {
    setLoading(true);
    try {
      await api.hr.employee.report.delete(employeeId, timesheetId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    employeeTimesheets,
    employeeReports,
    fetchEmployeeTimesheets,
    addEmployeeTimesheet,
    editEmployeeTimesheet,
    deleteEmployeeTimesheet,
    fetchEmployeeReport,
    addEmployeeReport,
    editEmployeeReport,
    deleteEmployeeReport,
  };
};
