import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';
import { api } from 'utils/api';

export const useHandleProject = (): {
  loadingProject: boolean;
  fetchProjects: (search: string) => any;
  addProject: (id: string, data: any) => any;
  editProject: (id: string, data: any) => any;
  deleteProject: (id: string, mid: string) => any;
} => {
  const [loadingProject, setLoadingProject] = useState(false);

  const fetchProjects = useCallback(async (search: string) => {
    try {
      const response: any = await api.hr.project.list(search);
      return response.results;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProject(false);
    }
  }, []);

  const addProject = async (id, data) => {
    setLoadingProject(true);
    try {
      const member = cloneDeep(data);
      member.employee = id;
      member.allocation = parseFloat(member.allocation).toFixed(1);
      const response = await api.hr.project.createMember(data.project, member);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const editProject = async (id, data) => {
    setLoadingProject(true);
    try {
      const member = cloneDeep(data);
      member.employee = id;
      member.allocation = parseFloat(member.allocation).toFixed(1);
      const response = await api.hr.project.updateMember(
        data.project,
        id,
        member,
      );
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const deleteProject = async (id: string, mid: string) => {
    setLoadingProject(true);
    try {
      await api.hr.project.deleteMember(id, mid);
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProject(false);
    }
  };

  return {
    loadingProject,
    fetchProjects,
    addProject,
    editProject,
    deleteProject,
  };
};
