import { useState } from 'react';
import fakeAPI from 'utils/fakeAPI';
export const useHandleMember = (): {
  loadingMember: boolean;
  addMember: (id: string, data: any) => any;
  editMember: (id: string, data: any) => any;
  deleteMember: (id: string, mid: string) => any;
} => {
  const [loadingMember, setLoadingMember] = useState(false);
  const addMember = async (id, data) => {
    setLoadingMember(true);
    try {
      data.members.allocation = parseFloat(data.members.allocation).toFixed(1);
      const response = await fakeAPI.post(
        `/hr/projects/${id}/members/`,
        data.members,
      );
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMember(false);
    }
  };

  const editMember = async (id, data) => {
    setLoadingMember(true);
    try {
      data.members.allocation = parseFloat(data.members.allocation).toFixed(1);
      const response = await fakeAPI.patch(
        `/hr/projects/${id}/members/${data.members.employee}/`,
        data.members,
      );
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMember(false);
    }
  };

  const deleteMember = async (id: string, mid: string) => {
    setLoadingMember(true);
    try {
      await fakeAPI.delete(`/hr/projects/${id}/members/${mid}`);
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMember(false);
    }
  };

  return { loadingMember, addMember, editMember, deleteMember };
};
