import {
  Employee,
  Project,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { SelectOption } from '@hdwebsoft/intranet-api-sdk/libs/type';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleTasks = (): {
  projects: Project[];
  employees: Employee[];
  projectOptions: SelectOption[];
  employeeOptions: SelectOption[];
  statuses: SelectOption[];
  error?: Error;
  getProjects: () => Promise<void>;
  getEmployees: () => Promise<void>;
  getStatuses: () => Promise<void>;
} => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projectOptions, setProjectOptions] = useState<SelectOption[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<SelectOption[]>([]);
  const [statuses, setStatuses] = useState<SelectOption[]>([]);
  const [error, setError] = useState<Error>();

  const getProjects = useCallback(async () => {
    try {
      const response = await api.hr.project.list(
        undefined,
        undefined,
        undefined,
        1,
        500,
      );
      if (response) {
        const mapProjectsOption: any = [...response.results].map(project => {
          return {
            label: project.name,
            value: project.id,
          };
        });
        setProjects(response.results);
        setProjectOptions(mapProjectsOption);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

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
        const mapEmployeeOption: SelectOption[] = [...response.results].map(
          employee => {
            return {
              label: employee.first_name + ' ' + employee.last_name,
              value: employee.id,
            };
          },
        );
        setEmployees(response.results);
        setEmployeeOptions(mapEmployeeOption);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  const getStatuses = useCallback(async () => {
    try {
      const response = await api.hr.task.getStatuses();
      if (response) {
        setStatuses(response);
      }
    } catch (error: any) {
      setError(error);
    }
  }, []);

  return {
    projects,
    employees,
    projectOptions,
    employeeOptions,
    statuses,
    error,
    getProjects,
    getEmployees,
    getStatuses,
  };
};
