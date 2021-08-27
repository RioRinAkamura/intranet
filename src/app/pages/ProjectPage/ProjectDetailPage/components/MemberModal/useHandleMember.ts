import { useState } from 'react';
import { api } from 'utils/api';

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
      const response = await api.hr.project.createMember(id, data.members);
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
      const response = await api.hr.project.updateMember(
        id,
        data.members.employee,
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
      await api.hr.project.deleteMember(id, mid);
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMember(false);
    }
  };

  return { loadingMember, addMember, editMember, deleteMember };
};
