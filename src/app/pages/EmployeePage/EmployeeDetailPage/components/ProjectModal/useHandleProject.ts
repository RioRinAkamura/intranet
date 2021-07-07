import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';
import fakeAPI from 'utils/fakeAPI';
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
      const response: any = await fakeAPI.get('/hr/projects/', {
        params: {
          search: search,
        },
      });
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
      const response = await fakeAPI.post(
        `/hr/projects/${data.project}/members/`,
        member,
      );
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
      const response = await fakeAPI.patch(
        `/hr/projects/${data.project}/members/${id}/`,
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
      await fakeAPI.delete(`/hr/projects/${id}/members/${mid}`);
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
