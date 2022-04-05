import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import {
  CreateProjectTimesheetQueryParams,
  ProjectTimesheet,
  Report,
  UpdateProjectTimesheetQueryParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import {
  Pagination,
  SelectOption,
} from '@hdwebsoft/intranet-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleProjectTimesheets = (): {
  loading: boolean;
  error: boolean;
  projectTimesheets: Pagination<ProjectTimesheet>;
  projectTimesheetItems: ProjectTimesheet[];
  employeeReports: Report[];
  employees: Employee[];
  workStatus: SelectOption[];
  getworkStatus: () => Promise<void>;

  fetchProjectTimesheets: () => void;
  addProjectTimesheet: (data: UpdateProjectTimesheetQueryParams) => void;
  editProjectTimesheet: (data: UpdateProjectTimesheetQueryParams) => void;
  deleteProjectTimesheet: (timesheetId: string) => void;
  getEmployees: () => Promise<void>;
  getEmployeeReport: (employeeId: string, date: string) => Promise<void>;
  getProjectTimesheetItems: (timesheetId: string) => Promise<void>;
} => {
  const [projectTimesheets, setProjectTimesheets] = useState<
    Pagination<ProjectTimesheet>
  >({
    count: 0,
    results: [],
    next: '',
    previous: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeReports, setEmployeeReport] = useState<Report[]>([]);
  const [projectTimesheetItems, setProjectTimesheetItems] = useState<
    ProjectTimesheet[]
  >([]);
  const [workStatus, setWorkStatus] = useState<SelectOption[]>([]);

  const fetchProjectTimesheets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.hr.projectTimesheet.list();
      setProjectTimesheets(response);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProjectTimesheet = async (
    data: CreateProjectTimesheetQueryParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.projectTimesheet.create(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const editProjectTimesheet = async (
    data: UpdateProjectTimesheetQueryParams,
  ) => {
    setLoading(true);
    try {
      await api.hr.projectTimesheet.update(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteProjectTimesheet = async (timesheetId: string) => {
    setLoading(true);
    try {
      await api.hr.projectTimesheet.delete(timesheetId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployees = useCallback(async () => {
    try {
      const response = await api.hr.employee.list(
        undefined,
        undefined,
        undefined,
        1,
        500,
      );
      if (response) {
        setEmployees(response.results);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  const getProjectTimesheetItems = useCallback(async (timesheetId: string) => {
    setLoading(true);
    try {
      const response = await api.hr.projectTimesheet.listReport(timesheetId);
      if (response) {
        setProjectTimesheetItems(response.results);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployeeReport = useCallback(
    async (employeeId: string, date: string) => {
      setLoading(true);
      try {
        const response = await api.hr.employee.report.listByDate(
          employeeId,
          date,
        );
        if (response) {
          setEmployeeReport(response.results);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getworkStatus = useCallback(async () => {
    try {
      const response = await api.hr.projectTimesheet.getWorkStatus();
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
    projectTimesheets,
    projectTimesheetItems,
    employees,
    employeeReports,
    workStatus,
    getworkStatus,
    fetchProjectTimesheets,
    addProjectTimesheet,
    editProjectTimesheet,
    deleteProjectTimesheet,
    getEmployees,
    getProjectTimesheetItems,
    getEmployeeReport,
  };
};
