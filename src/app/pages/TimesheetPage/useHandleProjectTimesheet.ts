import {
  CreateReportQueryParams,
  ProjectTimesheet,
  ProjectTimesheetQueryParams,
  Report,
  ReportQueryParams,
  UpdateProjectTimesheetQueryParams,
  UpdateReportQueryParams,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/timesheet/models';
import { Pagination } from '@hdwebsoft/intranet-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleProjectTimesheets = (): {
  loading: boolean;
  error: boolean;
  projectTimesheets: Pagination<ProjectTimesheet>;
  projectReports: Pagination<Report>;
  fetchProjectTimesheets: () => void;
  addProjectTimesheet: (
    projectId: string,
    data: ProjectTimesheetQueryParams,
  ) => void;
  editProjectTimesheet: (
    projectId: string,
    data: UpdateProjectTimesheetQueryParams,
  ) => void;
  deleteProjectTimesheet: (projectId: string, timesheetId: string) => void;
  //REPORT
  // fetchProjectReport: (projectId: string) => void;
  // addProjectReport: (projectId: string, data: ReportQueryParams) => void;
  // editProjectReport: (projectId: string, data: ReportQueryParams) => void;
  // deleteProjectReport: (projectId: string, timesheetId: string) => void;
} => {
  const [projectTimesheets, setProjectTimesheets] = useState<
    Pagination<ProjectTimesheet>
  >({
    count: 0,
    results: [],
    next: '',
    previous: '',
  });

  const [projectReports, setProjectReports] = useState<Pagination<Report>>({
    count: 0,
    results: [],
    next: '',
    previous: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchProjectTimesheets = useCallback(async () => {
    try {
      const response = await api.hr.projectTimesheet.list();
      setProjectTimesheets(response);
      console.log('projectTimesheets', projectTimesheets);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProjectTimesheet = async (
    projectId: string,
    data: ProjectTimesheetQueryParams,
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
    projectId: string,
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

  const deleteProjectTimesheet = async (
    projectId: string,
    timesheetId: string,
  ) => {
    setLoading(true);
    try {
      await api.hr.projectTimesheet.delete(timesheetId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //REPORT

  // const fetchProjectReport = useCallback(async (projectId: string) => {
  //   try {
  //     const response = await api.hr.projectTimesheet.list(projectId);
  //     if (response) {
  //       setProjectReports(response);
  //     }
  //   } catch (error) {
  //     setError(error);
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const addProjectReport = async (
  //   projectId: string,
  //   data: CreateReportQueryParams,
  // ) => {
  //   setLoading(true);
  //   try {
  //     await api.hr.project.report.create(projectId, data);
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const editProjectReport = async (
  //   projectId: string,
  //   data: UpdateReportQueryParams,
  // ) => {
  //   setLoading(true);
  //   try {
  //     await api.hr.project.report.update(projectId, data);
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const deleteProjectReport = async (projectId: string, reportId: string) => {
  //   setLoading(true);
  //   try {
  //     await api.hr.project.report.delete(projectId, reportId);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    loading,
    error,
    projectTimesheets,
    projectReports,
    fetchProjectTimesheets,
    addProjectTimesheet,
    editProjectTimesheet,
    deleteProjectTimesheet,
    // fetchProjectReport,
    // addProjectReport,
    // editProjectReport,
    // deleteProjectReport,
  };
};
